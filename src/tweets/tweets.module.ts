import { Module } from '@nestjs/common'
import { TweetsService } from './tweets.service'
import { TweetsResolver } from './tweets.resolver'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tweet } from './tweet.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Tweet])],
  providers: [TweetsResolver, TweetsService],
})
export class TweetsModule {}
