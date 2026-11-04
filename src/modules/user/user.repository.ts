import { Injectable } from '@nestjs/common'

import { Prisma } from '../../../generated/prisma/index.js'
import { PrismaService } from '../../database/prisma.service.js'

export class UserCreateDto {
  accountId: string
  passwordHash: string
  name?: string
}

@Injectable()
export class UserRepository {
  constructor(private readonly database: PrismaService) {}

  async create(
    data: UserCreateDto,
    database: Prisma.TransactionClient | PrismaService = this.database,
  ) {
    try {
      return await database.user.create({
        data: {
          accountId: data.accountId,
          passwordHash: data.passwordHash,
          name: data.name, // null
        },
      })
    } catch {
      throw new Error('Failed to create user.')
    }
  }
}
