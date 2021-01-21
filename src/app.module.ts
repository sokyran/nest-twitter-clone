import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { GraphQLError, GraphQLFormattedError } from 'graphql'
import { Tweet } from './tweets/tweet.entity'
import { TweetsModule } from './tweets/tweets.module'
import { AuthModule } from './auth/auth.module'
import { User } from './auth/user.entity'
import * as depthLimit from 'graphql-depth-limit'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'twitter-clone',
      entities: [Tweet, User],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      validationRules: [depthLimit(3)],
      formatError: (error: GraphQLError) => {
        console.log(error)
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
          extensions: error.extensions.code,
        }
        return graphQLFormattedError
      },
    }),
    TweetsModule,
    AuthModule,
  ],
})
export class AppModule {}
