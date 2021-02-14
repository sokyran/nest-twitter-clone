import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { CreateCommentInput } from './dto/create-comment.input'
import { CreateTweetInput } from './dto/create-tweet.input'
import { GetUser } from '../auth/get-user.decorator'
import { Logger, UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/gql.guard'
import { TweetsService } from './tweets.service'
import { User } from '../auth/user.entity'
import { TweetType } from './tweet.type'
import UsersLoader from 'src/auth/user.loader'

@Resolver(() => TweetType)
export class TweetsResolver {
  constructor(
    private readonly tweetsService: TweetsService,
    private readonly usersLoader: UsersLoader,
  ) {}

  private readonly logger = new Logger('tweetsResolver')

  @Query(() => [TweetType], { name: 'tweets' })
  async findAll(
    @Args('withComments', { type: () => Boolean, nullable: true })
    withComments: boolean,
  ) {
    const res = await this.tweetsService.findAll(withComments)
    return res
  }

  @Query(() => TweetType, { name: 'tweet' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Args('loadComments', { type: () => Boolean, nullable: true })
    loadComments: boolean,
  ) {
    return await this.tweetsService.findOne(id, loadComments)
  }

  @Mutation(() => TweetType)
  @UseGuards(GqlAuthGuard)
  createTweet(
    @Args('createTweetInput') createTweetInput: CreateTweetInput,
    @GetUser() user: User,
  ) {
    return this.tweetsService.create(createTweetInput, user)
  }

  @Mutation(() => TweetType)
  @UseGuards(GqlAuthGuard)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @GetUser() user: User,
  ) {
    return this.tweetsService.createComment(createCommentInput, user)
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
    return await this.usersLoader.batchUsers.load(userId)
  }
}
