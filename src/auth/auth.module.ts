import { TweetsModule } from '../tweets/tweets.module'
import { forwardRef, Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthResolver } from './auth.resolver'
import { ConfigModule } from '@nestjs/config'
import { AuthService } from './auth.service'
import { JwtStrategy } from './jwt.strategy'
import { JwtModule } from '@nestjs/jwt'
import { User } from './user.entity'
import { AuthController } from './auth.controller'
import UsersLoader from './user.loader'
import { Profile } from './profile.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile]),
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    forwardRef(() => TweetsModule),
  ],
  providers: [AuthService, AuthResolver, JwtStrategy, UsersLoader],
  exports: [AuthService, UsersLoader],
  controllers: [AuthController],
})
export class AuthModule {}
