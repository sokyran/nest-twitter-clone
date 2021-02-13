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
import UsersLoader from './user.loader'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
})
export class AuthModule {}
