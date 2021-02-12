import { CreateTweetInput } from './create-tweet.input'
import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class CreateCommentInput extends CreateTweetInput {
  @Field(() => Int)
  commentParent: number
}
