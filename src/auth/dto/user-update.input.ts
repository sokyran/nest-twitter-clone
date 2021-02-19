import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator'
import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class UserUpdateInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'User Tag must be longer than 4 characters' })
  usertag: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(4, { message: 'User Tag must be longer than 4 characters' })
  username: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl(undefined, { message: 'Avatar must be an URL' })
  avatar: string
}
