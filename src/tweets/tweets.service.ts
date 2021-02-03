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
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger('tweetService')

  async create(createTweetInput: CreateTweetInput, user: User): Promise<Tweet> {
    const { text, imageUrl } = createTweetInput
    const tweet = new Tweet()
    tweet.text = text
    tweet.date = new Date().toISOString()
    tweet.user = user
    tweet.imageUrl = imageUrl
    await tweet.save()
    return tweet
  }

  async findAll(): Promise<Tweet[]> {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.orderBy('tweet.date', 'DESC')
    return await query.getMany()
  }

  async findByUser(userId: number): Promise<Tweet[]> {
    return await this.tweetRepository.find({ userId })
  }

  async findOne(id: number) {
    const found = await this.tweetRepository.findOne({ id })
    if (found && Object.values(found).length > 0) {
      return found
    }
    throw new NotFoundException(`Tweet with "${id}" id was not found`)
  }

  async updateLikes(id: number, user: User, add = true) {
    const found = await this.findOne(id)
    const foundUser = await this.userRepository.findOne({ id: user.id })
    let likes = add ? found.likes + 1 : found.likes - 1
    if (likes <= 0) {
      likes = 0
    }

    if (add) {
      await this.userRepository.save({
        ...foundUser,
        likedTweets:
          foundUser.likedTweets.indexOf(id) > -1
            ? foundUser.likedTweets
            : foundUser.likedTweets.concat(id),
      })
    } else {
      await this.userRepository.save({
        ...foundUser,
        likedTweets: foundUser.likedTweets.filter((t) => t !== id),
      })
    }
    return await this.tweetRepository.save({ ...found, likes })
  }

  async remove(id: number): Promise<any> {
    const result = await this.tweetRepository.delete({ id })
    if (result.affected) {
      return result.affected
    }
  }
}
