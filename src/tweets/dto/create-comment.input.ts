import { InputType, Field, Int } from '@nestjs/graphql'
import { CreateTweetInput } from './create-tweet.input'

@InputType()
export class CreateCommentInput extends CreateTweetInput {
  @Field(() => Int)
  commentParent: number
}
