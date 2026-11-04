import { ConflictException, Injectable } from '@nestjs/common'

import { Prisma } from '../../../generated/prisma/index.js'
import { PrismaService } from '../../database/prisma.service.js'

export class AccountContactCreateDto {
  accountId: string
  name: string
  email: string
  phoneNumber: string
}

@Injectable()
export class AccountContactRepository {
  constructor(private readonly database: PrismaService) {}

  async create(
    data: AccountContactCreateDto,
    database: Prisma.TransactionClient | PrismaService = this.database,
  ) {
    try {
      return await database.accountContact.create({
        data: {
          accountId: data.accountId,
          name: data.name,
          email: data.email, // unique
          phoneNumber: data.phoneNumber, // null
        },
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        Array.isArray(error.meta?.target) &&
        error.meta.target.includes('email')
      ) {
        throw new ConflictException('Email is already registered.')
      }
      throw new Error('Failed to create account contact.')
    }
  }
}
