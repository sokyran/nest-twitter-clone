import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql'
import { TweetType } from 'src/tweets/tweet.type'

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: number

  @Field()
  username: string

  @Field()
  password: string

  @Field(() => [TweetType])
  tweets: TweetType[]
}

@ObjectType('NoPassUser')
export class NoPassUserType extends OmitType(UserType, ['password']) {}

@ObjectType('AccessToken')
export class AccessToken {
  @Field()
  access_token: string
}
