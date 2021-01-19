import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UserInfoInput {
  @Field(() => String)
  username: string

  @Field(() => String)
  password: string
}
