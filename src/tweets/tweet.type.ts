import { ObjectType, Field, ID } from '@nestjs/graphql'
import { UserType } from 'src/auth/user.type'

@ObjectType('Tweet')
export class TweetType {
  @Field(() => ID)
  id: number

  @Field()
  text: string

  @Field()
  date: string

  @Field()
  userId: number

  @Field(() => UserType)
  user: UserType

  @Field({ nullable: true })
  imageUrl: string
}
