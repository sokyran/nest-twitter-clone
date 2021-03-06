import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { UserUpdateInput } from './dto/user-update.input'
import { UserLoginInput } from './dto/user-login.input'
import { UserInfoInput } from './dto/user-info.input'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import { Repository } from 'typeorm'
import { User, UserWithProfile } from './user.entity'
import * as bcrypt from 'bcrypt'
import { Profile } from './profile.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger()

  async findOne(id: number): Promise<Partial<User>> {
    const found = await this.userRepository.findOne({ id })
    if (!found) {
      throw new NotFoundException(`User with id "${id}" does not exist`)
    }
    return found
  }

  async findAllByIds(ids: number[]): Promise<User[]> {
    return await this.userRepository.findByIds(ids)
  }

  async updateUser(userUpdate: UserUpdateInput): Promise<Partial<User>> {
    const { id, backgroundImage, location, biography } = userUpdate
    const newUser = await this.userRepository.save({ id, ...userUpdate })
    const profile = await this.profileRepository.findOne({
      userId: id,
    })
    profile.backgroundImage = backgroundImage
    profile.location = location
    profile.biography = biography
    await profile.save()
    return newUser
  }

  async getLikes(id: number | null): Promise<number[]> {
    if (id === null) {
      return []
    }
  }

  async getProfile(id: number): Promise<UserWithProfile> {
    const query = this.userRepository.createQueryBuilder('user')
    query.where('user.id = :id', { id })
    query.leftJoinAndMapOne(
      'user.profile',
      Profile,
      'profile',
      'profile.userId = :id',
      { id },
    )
    return (await query.getOne()) as UserWithProfile
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
      const profile = new Profile()
      profile.userId = user.id
      profile.registrationDate = new Date().toDateString()
      await profile.save()
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

  async genToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      id: user.id,
      usertag: user.usertag,
      username: user.username,
    }
    return {
      accessToken: this.jwtService.sign(payload),
    }
  }

  async signIn(
    userLogin: UserLoginInput,
  ): Promise<User | { accessToken: string }> {
    const valid = await this.validateLogin(userLogin)
    if (valid) {
      const token = await this.genToken(valid)
      return { accessToken: token.accessToken, ...valid }
    }
    throw new UnauthorizedException('Login is invalid')
  }
}
