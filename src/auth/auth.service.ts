import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInfoInput } from './dto/user-info.input'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(userInfo: UserInfoInput): Promise<Partial<User>> {
    const { username, password } = userInfo
    const user = new User()
    const salt = await bcrypt.genSalt()
    user.username = username
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    return { username: user.username, id: user.id }
  }

  async validateLogin(userInfo: UserInfoInput): Promise<Partial<User>> | null {
    const { username, password } = userInfo

    const found = await this.userRepository.findOne({ username })

    if (found && (await bcrypt.compare(password, found.password))) {
      delete found.password
      return found
    }
    return null
  }

  async genToken(user: Partial<User>): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async signIn(userInfo: UserInfoInput): Promise<{ access_token: string }> {
    const valid = await this.validateLogin(userInfo)
    if (valid) {
      return await this.genToken(valid)
    }
    throw new UnauthorizedException('Login is invalid')
  }
}
