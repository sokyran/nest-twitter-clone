import { Logger, UseGuards, ValidationPipe } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { TweetsService } from 'src/tweets/tweets.service'
import { UserUpdateInput } from './dto/user-update.input'
import { UserLoginInput } from './dto/user-login.input'
import { UserInfoInput } from './dto/user-info.input'
import { UserType, UserWithProfileType, UserWithToken } from './user.type'
import { AuthService } from './auth.service'
import { GqlAuthGuard } from './gql.guard'

@Resolver(() => UserType)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly tweetsService: TweetsService,
  ) {}

  private readonly logger = new Logger('authResolver')

  @Query(() => UserWithProfileType)
  async getProfile(@Args('id') id: number) {
    return await this.authService.getProfile(id)
  }

  @Mutation(() => UserType)
  async signUp(
    @Args('userInfoInput', new ValidationPipe()) userInfo: UserInfoInput,
  ) {
    return await this.authService.signUp(userInfo)
  }

  @Mutation(() => UserType)
  @UseGuards(GqlAuthGuard)
  async updateProfile(
    @Args('userUpdateInput', new ValidationPipe()) userUpdate: UserUpdateInput,
  ) {
    const res = await this.authService.updateUser(userUpdate)
    this.logger.debug(res)
    return res
  }

  @Mutation(() => UserWithToken)
  async signIn(@Args('userLoginInput') userLogin: UserLoginInput) {
    return await this.authService.signIn(userLogin)
  }

  @ResolveField()
  async tweets(@Parent() user: UserType) {
    return await this.tweetsService.findByUser(user.id, false, false)
  }
}
