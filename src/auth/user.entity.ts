import { Tweet } from '../tweets/tweet.entity'
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

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

  @Column({ nullable: true, default: 'https://bp.io/avatar/img/base_mm_1.png' })
  avatar: string

  @OneToMany(() => Tweet, (tweet) => tweet.user, { eager: false })
  tweets: Tweet
}
