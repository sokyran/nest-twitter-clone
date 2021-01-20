import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../auth/user.entity'
import { Repository } from 'typeorm'
import { CreateTweetInput } from './dto/create-tweet.input'
import { Tweet } from './tweet.entity'

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
  ) {}

  private readonly logger = new Logger('tweetService')

  async create(createTweetInput: CreateTweetInput, user: User): Promise<Tweet> {
    const { text } = createTweetInput
    const tweet = new Tweet()
    tweet.text = text
    tweet.date = new Date().toISOString()
    tweet.user = user
    await tweet.save()
    return tweet
  }

  async findAll(): Promise<Tweet[]> {
    return await this.tweetRepository.find()
  }

  async findOne(id: number) {
    const found = await this.tweetRepository.findOne({ id })
    if (found && Object.values(found).length > 0) {
      return found
    }
    throw new NotFoundException(`Tweet with "${id}" id was not found`)
  }

  async remove(id: number): Promise<any> {
    const result = await this.tweetRepository.delete({ id })
    if (result.affected) {
      return result.affected
    }
    throw new NotFoundException(`Tweet with "${id}" id was not found`)
  }
}
