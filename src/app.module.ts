import { TweetsModule } from './tweets/tweets.module'
import * as depthLimit from 'graphql-depth-limit'
import { AuthModule } from './auth/auth.module'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { Tweet } from './tweets/tweet.entity'
import { User } from './auth/user.entity'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'twitter-clone',
      entities: [Tweet, User],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      validationRules: [depthLimit(3)],
    }),
    TweetsModule,
    AuthModule,
  ],
})
export class AppModule {}
