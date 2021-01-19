import { ObjectType, Field, ID } from '@nestjs/graphql'

@ObjectType('Tweet')
export class TweetType {
  @Field(() => ID)
  id: number

  @Field()
  text: string

  @Field()
  date: string
}
