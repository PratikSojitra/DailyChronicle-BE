import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL'); 
    const jwksUri = `${supabaseUrl}/auth/v1/.well-known/jwks.json`;

    super({
      jwtFromRequest: (request: any) => {
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
        
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            }
          } catch (e) {}
        }
        return token;
      },
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: jwksUri,
      }),
      algorithms: ['ES256', 'HS256'],
      issuer: `${supabaseUrl}/auth/v1`,
      audience: 'authenticated',
    });
  }

  async validate(payload: any) {

    if (!payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }

    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
        throw new UnauthorizedException(`User ID ${payload.sub} not registered`);
    }
    return user; 
  }
}