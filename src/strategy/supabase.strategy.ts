import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super({
      // --- DEBUGGING CHANGE: Custom Extractor to spy on the header ---
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          const authHeader = request?.headers?.authorization;
          console.log('\n--- 🔍 DEBUG: INCOMING REQUEST ---');
          console.log('Raw Authorization Header:', authHeader ? authHeader : 'MISSING');
          
          if (!authHeader) return null;
          
          // clean up the token
          const token = authHeader.replace('Bearer ', '').trim();
          console.log('Token extracted:', token.substring(0, 10) + '...');
          return token;
        },
      ]),
      // ---------------------------------------------------------------
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('--- ✅ SIGNATURE VALIDATED! ---');
    console.log('Searching for User ID:', payload.sub);

    // CRITICAL: We check the DB for the exact UUID from the token
    let user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
        console.log('❌ User not found in DB. Make sure ID matches:', payload.sub);
        throw new UnauthorizedException();
    }

    console.log('✅ User found:', user.email);
    return user; 
  }
}