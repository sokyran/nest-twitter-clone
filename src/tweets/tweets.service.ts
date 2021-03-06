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
    const { text, imageUrl, parentTweetId } = createCommentInput
    const parentTweet = await this.findOne(parentTweetId, false)
    const tweet = new Tweet()
    tweet.text = text
    tweet.user = user
    tweet.imageUrl = imageUrl
    tweet.date = new Date().toISOString()
    tweet.conversationId = parentTweet.conversationId
      ? parentTweet.conversationId
      : parentTweetId
    tweet.inResponseTo = parentTweetId
    await tweet.save()
    return tweet
  }

  async findAll(): Promise<Tweet[]> {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.where('tweet.inResponseTo IS NULL')
    query.orderBy('tweet.date', 'DESC')
    return await query.getMany()
  }

  async findAllByIds(ids: string[]): Promise<Tweet[]> {
    return await this.tweetRepository.findByIds(ids)
  }

  async findByUser(
    id: number,
    withComments: boolean,
    loadLikes: boolean,
  ): Promise<Tweet[]> {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.orderBy('tweet.date', 'DESC')
    if (loadLikes) {
      const subQuery = this.userRepository.createQueryBuilder('user')
      subQuery.select('unnest(user.likedTweets)')
      subQuery.where(`user.id = '${id}'`)
      query.where('tweet.id = any(' + subQuery.getQuery() + ')')
    } else {
      query.leftJoinAndSelect('tweet.user', 'user')
      query.where(`user.id = '${id}'`)
      if (!withComments) {
        query.andWhere('tweet.inResponseTo IS NULL')
      }
    }
    return await query.getMany()
  }

  async findOne(id: number, loadComments: boolean) {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.where('tweet.id = :id', { id })
    if (loadComments) {
      query.leftJoinAndMapMany(
        'tweet.comments',
        Tweet,
        'comments',
        'comments.conversationId = :id',
        { id },
      )
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

  async getCommentCount(id: number) {
    const query = this.tweetRepository.createQueryBuilder('tweet')
    query.select('COUNT(*)', 'count')
    query.where('"tweet"."conversationId"= :id', { id: Number(id) })
    query.andWhere('"tweet"."conversationId" IS NOT NULL')
    query.groupBy('"tweet"."conversationId"')
    const res = await query.getRawOne()
    if (res) {
      return res.count
    }
    return 0
  }

  async remove(id: number): Promise<any> {
    const found = await this.findOne(id, false)
    found.isDeleted = true
    await found.save()
    return found
  }
}
