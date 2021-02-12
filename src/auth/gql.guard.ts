import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthenticationError } from 'apollo-server-core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context)
    const { req } = ctx.getContext()

    return super.canActivate(new ExecutionContextHost([req]))
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new AuthenticationError('GqlAuthGuard')
    }
    return user
  }
}
