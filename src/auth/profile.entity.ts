import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class Profile extends BaseEntity {
  @PrimaryColumn()
  usertag: string

  @Column()
  registrationDate: string

  @Column({ nullable: true })
  biography: string

  @Column({ nullable: true })
  location: string

  @Column({ nullable: true })
  backgroundImage: string
}
