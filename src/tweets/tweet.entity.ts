import { User } from '../auth/user.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.tweets, { eager: false })
  user: User

  @Column({ nullable: true })
  commentParent: number
}
