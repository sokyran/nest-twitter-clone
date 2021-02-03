import { forwardRef, Module } from '@nestjs/common'
import { TweetsService } from './tweets.service'
import { TweetsResolver } from './tweets.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tweet } from './tweet.entity'
import { AuthModule } from 'src/auth/auth.module'
import { User } from 'src/auth/user.entity'

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
