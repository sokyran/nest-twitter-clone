import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from './auth.service'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/user')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Request() req) {
    const profile = await this.authService.getProfile(req.user.id)
    return profile
  }

  @Get('/')
  simpleRoute() {
    return 'hello'
  }
}
