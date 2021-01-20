import { InputType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString, MinLength } from 'class-validator'

@InputType()
export class UserInfoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Username must be longer than 4 characters' })
  username: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string
}
