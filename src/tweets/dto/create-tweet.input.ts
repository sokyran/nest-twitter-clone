import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class CreateTweetInput {
  @Field(() => String)
  text: string

  @Field(() => String, { nullable: true })
  imageUrl: string
}
