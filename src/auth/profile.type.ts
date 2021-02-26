import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('Profile')
export class ProfileType {
  @Field()
  usertag: string

  @Field()
  registrationDate: string

  @Field({ nullable: true })
  biography: string

  @Field({ nullable: true })
  location: string

  @Field({ nullable: true })
  backgroundImage: string
}
