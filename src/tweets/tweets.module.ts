import { forwardRef, Module } from '@nestjs/common'
import { TweetsService } from './tweets.service'
import { TweetsResolver } from './tweets.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tweet } from './tweet.entity'
import { AuthModule } from 'src/auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([Tweet]), forwardRef(() => AuthModule)],
  providers: [TweetsResolver, TweetsService],
  exports: [TweetsService],
})
export class TweetsModule {}
