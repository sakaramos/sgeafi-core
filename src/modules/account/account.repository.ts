import { Injectable } from '@nestjs/common'

import { Prisma } from '../../../generated/prisma/index.js'
import { PrismaService } from '../../database/prisma.service.js'

export class AccountCreateDto {
  name: string
}

@Injectable()
export class AccountRepository {
  constructor(private readonly database: PrismaService) {}

  async create(
    data: AccountCreateDto,
    database: Prisma.TransactionClient | PrismaService = this.database,
  ) {
    try {
      return await database.account.create({
        data: {
          name: data.name,
        },
      })
    } catch {
      throw new Error(`Failed to create account.`)
    }
  }
}
