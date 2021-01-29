import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TweetType } from 'src/tweets/tweet.type'

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: number

  @Field()
  username: string

  @Field()
  usertag: string

  @Field({ nullable: true })
  avatar: string

  @Field(() => [TweetType], { nullable: true })
  tweets: TweetType[]
}

@ObjectType('AccessToken')
export class AccessToken {
  @Field()
  access_token: string
}

@ObjectType('UserWithToken')
export class UserWithToken extends UserType {
  @Field()
  access_token: string
}
