import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql'
import { TweetsService } from './tweets.service'
import { CreateTweetInput } from './dto/create-tweet.input'
import { TweetType } from './tweet.type'
import { Logger, UseGuards } from '@nestjs/common'
import { User } from 'src/auth/user.entity'
import { GetUser } from 'src/auth/get-user.decorator'
import { GqlAuthGuard } from 'src/auth/gql.guard'

@Resolver(() => TweetType)
export class TweetsResolver {
  constructor(private readonly tweetsService: TweetsService) {}
  private readonly logger = new Logger('tweetsResolver')

  @Mutation(() => TweetType)
  @UseGuards(GqlAuthGuard)
  createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @GetUser() user: User,
  ) {
    return this.tweetsService.create(createTweetInput, user)
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
