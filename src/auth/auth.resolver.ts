import { Logger, ValidationPipe } from '@nestjs/common'
import { Args, Mutation, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { TweetsService } from 'src/tweets/tweets.service'
import { AuthService } from './auth.service'
import { UserInfoInput } from './dto/user-info.input'
import { UserLoginInput } from './dto/user-login.input'
import { UserType, UserWithToken } from './user.type'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tweetsService: TweetsService,
  ) {}

  private readonly logger = new Logger('authResolver')

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
