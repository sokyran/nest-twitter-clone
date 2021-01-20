import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TweetType } from 'src/tweets/tweet.type'

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: number

  @Field()
  username: string

  @Field(() => [TweetType])
  tweets: TweetType[]
}

@ObjectType('AccessToken')
export class AccessToken {
  @Field()
  access_token: string
}
