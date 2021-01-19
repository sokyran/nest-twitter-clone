import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { TweetsService } from './tweets.service'
import { CreateTweetInput } from './dto/create-tweet.input'
import { TweetType } from './tweet.type'
import { Logger } from '@nestjs/common'

@Resolver(() => TweetType)
export class TweetsResolver {
  constructor(private readonly tweetsService: TweetsService) {}
  private readonly logger = new Logger('tweetsResolver')

  @Mutation(() => TweetType)
  createTweet(@Args('createTweetInput') createTweetInput: CreateTweetInput) {
    return this.tweetsService.create(createTweetInput)
  }

  @Query(() => [TweetType], { name: 'tweets' })
  findAll() {
    return this.tweetsService.findAll()
  }

  @Query(() => TweetType, { name: 'tweet' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.tweetsService.findOne(id)
  }

  @Mutation(() => Int)
  removeTweet(@Args('id', { type: () => Int }) id: number) {
    return this.tweetsService.remove(id)
  }
}
