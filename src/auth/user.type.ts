import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TweetType } from 'src/tweets/tweet.type'
import { ProfileType } from './profile.type'

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

  @Field(() => [Number])
  likedTweets: number[]

  @Field(() => [TweetType], { nullable: true })
  tweets: TweetType[]
}

@ObjectType('UserWithToken')
export class UserWithToken extends UserType {
  @Field()
  accessToken: string
}

@ObjectType('UserWithProfile')
export class UserWithProfileType extends UserType {
  @Field(() => ProfileType)
  profile: ProfileType
}
