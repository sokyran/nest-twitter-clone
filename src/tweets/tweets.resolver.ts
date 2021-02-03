import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { TweetsService } from './tweets.service'
import { CreateTweetInput } from './dto/create-tweet.input'
import { TweetType } from './tweet.type'
import { Logger, UseGuards } from '@nestjs/common'
import { User } from '../auth/user.entity'
import { GetUser } from '../auth/get-user.decorator'
import { GqlAuthGuard } from '../auth/gql.guard'
import { AuthService } from '../auth/auth.service'

@Resolver(() => TweetType)
export class TweetsResolver {
  constructor(
    private readonly tweetsService: TweetsService,
    private readonly authService: AuthService,
  ) {}
  private readonly logger = new Logger('tweetsResolver')

  @Query(() => [TweetType], { name: 'tweets' })
  async findAll() {
    const res = await this.tweetsService.findAll()
    return res
  }

  @Query(() => TweetType, { name: 'tweet' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.tweetsService.findOne(id)
  }

  @Mutation(() => TweetType)
  @UseGuards(GqlAuthGuard)
  createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @GetUser() user: User,
  ) {
    return this.tweetsService.create(createTweetInput, user)
  }

  @Mutation(() => Int)
  @UseGuards(GqlAuthGuard)
  removeTweet(@Args('id', { type: () => Int }) id: number) {
    return this.tweetsService.remove(id)
  }

  @Mutation(() => TweetType)
  @UseGuards(GqlAuthGuard)
  likeTweet(
    @Args('id', { type: () => Int }) id: number,
    @GetUser() user: User,
  ) {
    return this.tweetsService.updateLikes(id, user, true)
  }

  @Mutation(() => TweetType)
  @UseGuards(GqlAuthGuard)
  unlikeTweet(
    @Args('id', { type: () => Int }) id: number,
    @GetUser() user: User,
  ) {
    return this.tweetsService.updateLikes(id, user, false)
  }

  @ResolveField()
  async user(@Parent() tweet: TweetType) {
    const { userId } = tweet
    return await this.authService.findOne(userId)
  }
}
