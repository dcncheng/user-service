import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: 'abc-123',
      signOptions: {
        expiresIn: 3600,
      }
    }),
    TypeOrmModule.forFeature([
      UserRepository
    ]),
  ],
  controllers: [UsersController],
  providers: [
    JwtStrategy,
    UsersService
  ],
  exports: [
    JwtStrategy,
    PassportModule,
  ],
})
export class UsersModule {}
