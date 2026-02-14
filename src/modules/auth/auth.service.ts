import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from 'src/entities/user.entity';
import {
  AuthCredentialsDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto/auth-credentials.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) { }

  async getTokens(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const [at, rt] = await Promise.all([
      // Access Token (15 min)
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_SECRET, expiresIn: '15m' },
      ),
      // Refresh Token (7 days)
      this.jwtService.signAsync(
        { sub: userId, email },
        { secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret', expiresIn: '7d' },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(refreshToken, salt);
    await this.userRepository.update(userId, { hashedRefreshToken: hash });
  }

  // --- 1. SIGN UP ---
  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const { email, password, profileImage } = authCredentialsDto;

    // Hash the password (Salt + Hash)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword, // Store the HASH, not the real password
      role: UserRole.VIEWER, // Default role
      profileImage,
    });

    try {
      const newUser = await this.userRepository.save(user);
      const tokens = await this.getTokens(newUser.id, newUser.email);
      await this.updateRefreshTokenHash(newUser.id, tokens.refresh_token);
      return tokens;

    } catch (error) {
      if (error.code === '23505') {
        // Postgres error code for duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw error;
      }
    }
  }

  // --- 2. SIGN IN ---
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string; refresh_token: string; user: Partial<User> }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    // Validate Password
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);


    // Remove sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p, hashedRefreshToken: _h, ...userResponse } = user;

    return { ...tokens, user: userResponse };
  }

  async adminSignIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ access_token: string; refresh_token: string; user: Partial<User> }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    // Validate Password
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role === UserRole.VIEWER) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    // Remove sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _p2, hashedRefreshToken: _h2, ...userResponse } = user;

    return { ...tokens, user: userResponse };
  }

  async forgetPassword(
    forgetPasswordDto: ForgetPasswordDto,
    origin: string,
  ): Promise<void> {
    const { email } = forgetPasswordDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload = { email: user.email, id: user.id };
    const secret = (process.env.JWT_SECRET || '') + (user.password || '');
    const token = await this.jwtService.sign(payload, {
      secret,
      expiresIn: '15m',
    });

    await this.emailService.sendEmail(email, 'resetPassword', {
      id: user.id,
      token,
      origin,
    });
  }

  async logout(userId: string) {
    await this.userRepository.update(userId, { hashedRefreshToken: null });
  }

  async resetPassword(id: string, token: string, newPass: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');

    // Verify Token (using the dynamic secret)
    const secret = (process.env.JWT_SECRET || '') + (user.password || '');

    try {
      this.jwtService.verify(token, { secret });
    } catch (e) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPass, salt);

    await this.userRepository.save(user);

    return { message: 'Password updated successfully. Please login.' };
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access Denied');

    // Compare the Refresh Token sent by user vs the Hash in DB
    const rtMatches = await bcrypt.compare(rt, user.hashedRefreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    // If valid, generate a NEW pair of tokens
    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }
}
