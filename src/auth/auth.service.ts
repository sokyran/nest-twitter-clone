import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserInfoInput } from './dto/user-info.input'
import { User } from './user.entity'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UserLoginInput } from './dto/user-login.input'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(id: number): Promise<Partial<User>> {
    return await this.userRepository.findOne({ id })
  }

  async signUp(userInfo: UserInfoInput): Promise<Partial<User>> {
    const { username, usertag, password, avatar } = userInfo
    const user = new User()
    const salt = await bcrypt.genSalt()
    user.username = username
    user.usertag = usertag
    if (avatar) {
      user.avatar = avatar
    }
    user.password = await bcrypt.hash(password, salt)

    try {
      await user.save()
      return { username: user.username, id: user.id, usertag: user.usertag }
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Usertag already exists')
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async validateLogin(userLogin: UserLoginInput): Promise<User> | null {
    const { usertag, password } = userLogin

    const found = await this.userRepository.findOne({ usertag })

    if (found && (await bcrypt.compare(password, found.password))) {
      delete found.password
      return found
    }
    return null
  }

  async genToken(user: User): Promise<{ access_token: string }> {
    const payload = {
      id: user.id,
      usertag: user.usertag,
      username: user.username,
    }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async signIn(
    userLogin: UserLoginInput,
  ): Promise<User | { access_token: string }> {
    const valid = await this.validateLogin(userLogin)
    if (valid) {
      const token = await this.genToken(valid)
      return { access_token: token.access_token, ...valid }
    }
    throw new UnauthorizedException('Login is invalid')
  }
}
