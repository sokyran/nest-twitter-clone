import { forwardRef, Module } from '@nestjs/common'
import { TweetsResolver } from './tweets.resolver'
import { AuthModule } from 'src/auth/auth.module'
import { TweetsService } from './tweets.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/auth/user.entity'
import { Tweet } from './tweet.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
  ],
  providers: [TweetsResolver, TweetsService],
  exports: [TweetsService],
})
export class TweetsModule {}
