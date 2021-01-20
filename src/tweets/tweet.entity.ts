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

  @ManyToOne(() => User, (user) => user.tweets, { eager: false })
  user: User
}
