import { Logger, ValidationPipe } from '@nestjs/common'
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { TweetsService } from 'src/tweets/tweets.service'
import { UserLoginInput } from './dto/user-login.input'
import { UserInfoInput } from './dto/user-info.input'
import { UserType, UserWithToken } from './user.type'
import { AuthService } from './auth.service'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tweetsService: TweetsService,
  ) {}

  private readonly logger = new Logger('authResolver')

  @Query(() => [Int], { name: 'showLikes' })
  async getLikedTweets(
    @Args('id', { type: () => Int, nullable: true }) id: number,
  ) {
    return await this.authService.getLikes(id)
  }

  @Mutation(() => UserType)
  async signUp(
    @Args('userInfoInput', new ValidationPipe()) userInfo: UserInfoInput,
  ) {
    return await this.authService.signUp(userInfo)
  }

  @Mutation(() => UserWithToken)
  async signIn(@Args('userLoginInput') userLogin: UserLoginInput) {
    return await this.authService.signIn(userLogin)
  }

  @ResolveField()
  async tweets(@Parent() user: UserType) {
    return await this.tweetsService.findByUser(user.id)
  }
}
