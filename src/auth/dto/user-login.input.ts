import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { InputType, Field } from '@nestjs/graphql'

@InputType()
export class UserLoginInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'User Tag must be longer than 4 characters' })
  usertag: string

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string
}
