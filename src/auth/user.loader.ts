import { Injectable, Scope } from '@nestjs/common'
import { AuthService } from './auth.service'
import * as DataLoader from 'dataloader'

@Injectable({ scope: Scope.REQUEST })
export default class UsersLoader {
  constructor(private authService: AuthService) {}

  public readonly batchUsers = new DataLoader(async (ids: number[]) => {
    const users = await this.authService.findAllByIds(ids)
    const usersMap = new Map(users.map((user) => [user.id, user]))
    return ids.map((userId) => usersMap.get(userId))
  })
}
