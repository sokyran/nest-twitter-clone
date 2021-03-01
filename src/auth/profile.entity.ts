import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

@Entity()
@Unique(['userId'])
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  userId: number

  @Column()
  registrationDate: string

  @Column({ nullable: true })
  biography: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  backgroundImage: string
}
