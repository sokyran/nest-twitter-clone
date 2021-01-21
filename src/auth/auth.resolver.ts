import { ValidationPipe } from '@nestjs/common'
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { TweetsService } from 'src/tweets/tweets.service'
import { AuthService } from './auth.service'
import { UserInfoInput } from './dto/user-info.input'
import { AccessToken, UserType } from './user.type'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tweetsService: TweetsService,
  ) {}

  @Mutation(() => UserType)
  async signUp(
    @Args('userInfoInput', new ValidationPipe()) userInfo: UserInfoInput,
  ) {
    return await this.authService.signUp(userInfo)
  }

  @Mutation(() => AccessToken)
  async signIn(@Args('userInfoInput') userInfo: UserInfoInput) {
    return await this.authService.signIn(userInfo)
  }

  @ResolveField()
  async tweets(@Parent() user: UserType) {
    return await this.tweetsService.findByUser(user.id)
  }
}
