import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { UserInfoInput } from './dto/user-info.input'
import { AccessToken, NoPassUserType, UserType } from './user.type'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => NoPassUserType)
  async signUp(@Args('userInfoInput') userInfo: UserInfoInput) {
    return await this.authService.signUp(userInfo)
  }

  @Mutation(() => AccessToken)
  async signIn(@Args('userInfoInput') userInfo: UserInfoInput) {
    return await this.authService.signIn(userInfo)
  }
}
