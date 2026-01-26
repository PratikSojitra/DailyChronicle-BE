import { SupabaseStrategy } from "../../strategy/supabase.strategy";
import { PassportModule } from "@nestjs/passport";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        ConfigModule,
    ],
    providers: [SupabaseStrategy],
    exports: [SupabaseStrategy, PassportModule],
})
export class AuthModule {}