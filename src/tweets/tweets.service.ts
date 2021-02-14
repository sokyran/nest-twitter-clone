import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { CreateCommentInput } from './dto/create-comment.input'
import { CreateTweetInput } from './dto/create-tweet.input'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../auth/user.entity'
import { Tweet } from './tweet.entity'
import { Repository } from 'typeorm'

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet) private tweetRepository: Repository<Tweet>,
    @InjectRepository(User) private userRepository: Repository<User>, // private readonly tweetsDataLoader: TweetsDataLoader,
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
    const { text, imageUrl, parentTweetId } = createCommentInput
    const parentTweet = await this.findOne(parentTweetId, true)
    const tweet = new Tweet()
    tweet.text = text
    tweet.user = user
    tweet.imageUrl = imageUrl
    tweet.date = new Date().toISOString()
    if (!parentTweet.comments) {
      parentTweet.comments = [tweet]
    } else {
      parentTweet.comments = [...parentTweet.comments, tweet]
    }
    await parentTweet.save()
    return tweet
  }

  async findAll(withComments = false): Promise<Tweet[]> {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.leftJoinAndSelect('tweet.comments', 'comments')
    query.orderBy('tweet.date', 'DESC')
    if (!withComments) {
      query.where('tweet.parentTweetId IS NULL')
    }
    return await query.getMany()
  }

  async findAllByIds(ids: string[]): Promise<Tweet[]> {
    return await this.tweetRepository.findByIds(ids)
  }

  async findByUser(userId: number): Promise<Tweet[]> {
    return await this.tweetRepository.find({ userId })
  }

  async findOne(id: number, loadComments: boolean) {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.where('tweet.id = :id', { id })
    if (loadComments) {
      query.leftJoinAndSelect('tweet.comments', 'comments')
      query.leftJoinAndSelect('comments.comments', 'subcomments')
    }
    const found = await query.getOne()
    if (found && Object.values(found).length > 0) {
      return found
    }
    throw new NotFoundException(`Can't find tweet with id "${id}"`)
  }

  async updateLikes(id: number, user: User, add = true) {
    const found = await this.findOne(id, false)
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
    const found = await this.findOne(id, false)
    found.isDeleted = true
    await found.save()
    return found
  }
}
