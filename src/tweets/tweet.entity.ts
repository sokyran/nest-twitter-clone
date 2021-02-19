import { User } from '../auth/user.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  text: string

  @Column()
  date: string

  @Column()
  userId: number

  @Column({ default: 0 })
  likes: number

  @Column({ nullable: true })
  imageUrl: string

  @Column({ default: false })
  isDeleted: boolean

  @Column({ nullable: true })
  conversationId: number

  @Column({ nullable: true })
  commentCount: number

  @ManyToOne(() => User, (user) => user.tweets)
  user: User

  @ManyToOne(() => Tweet, (tweet) => tweet.comments)
  parentTweet: Tweet

  @OneToMany(() => Tweet, (tweet) => tweet.parentTweet, {
    cascade: true,
  })
  comments: Tweet[]
}
