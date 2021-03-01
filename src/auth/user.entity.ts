import { Tweet } from '../tweets/tweet.entity'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { Profile } from './profile.entity'

@Entity()
@Unique(['usertag'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column()
  usertag: string

  @Column()
  password: string

  @Column('int', { array: true, default: {} })
  likedTweets: number[]

  @Column({
    nullable: true,
    default:
      'https://www.meme-arsenal.com/memes/a5dd2f55b36488a10172f4f84352846b.jpg',
  })
  avatar: string

  @OneToMany(() => Tweet, (tweet) => tweet.user, { eager: false })
  tweets: Tweet
}

export class UserWithProfile extends User {
  profile: Profile
}
