import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../auth/user.entity'
import { Repository } from 'typeorm'
import { CreateTweetInput } from './dto/create-tweet.input'
import { Tweet } from './tweet.entity'
import { CreateCommentInput } from './dto/create-comment.input'

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
    tweet.user = user
    tweet.imageUrl = imageUrl
    tweet.date = new Date().toISOString()
    await tweet.save()
    return tweet
  }

  async createComment(
    createCommentInput: CreateCommentInput,
    user: User,
  ): Promise<Tweet> {
    const { text, imageUrl, commentParent } = createCommentInput
    const tweet = new Tweet()
    tweet.text = text
    tweet.user = user
    tweet.imageUrl = imageUrl
    tweet.commentParent = commentParent
    tweet.date = new Date().toISOString()
    await tweet.save()
    return tweet
  }

  async findAll(withComments = false): Promise<Tweet[]> {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.orderBy('tweet.date', 'DESC')
    if (!withComments) {
      query.where('tweet.commentParent IS NULL')
    }
    return await query.getMany()
  }

  async getComments(id: number): Promise<Tweet[]> {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.where('tweet.commentParent = :tweetId', { tweetId: id })

    const res = await query.getMany()
    return res
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
