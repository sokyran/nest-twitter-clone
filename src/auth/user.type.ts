import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('User')
export class UserType {
  @Field(() => ID)
  id: number

  @Field()
  username: string

  @Field()
  password: string
}

@ObjectType('NoPassUser')
export class NoPassUserType {
  @Field(() => ID)
  id: number

  @Field()
  username: string
}

@ObjectType('AccessToken')
export class AccessToken {
  @Field()
  access_token: string
}
