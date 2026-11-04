import { Injectable } from '@nestjs/common'

import { HashService } from '../../common/hash/hash.service.js'
import { PrismaService } from '../../database/prisma.service.js'
import { AccountContactRepository } from '../accountContact/accountContact.repository.js'
import { AccountRegisterDto } from './account.dto.js'
import { AccountRepository } from './account.repository.js'

@Injectable()
export class AccountService {
  constructor(
    private readonly hash: HashService,
    private readonly database: PrismaService,
    private readonly accountRepository: AccountRepository,
    private readonly accountContactRepository: AccountContactRepository,
  ) {}

  async register(dto: AccountRegisterDto) {
    await this.hash.hash(dto.password)

    return this.database.$transaction(async (transaction) => {
      const account = await this.accountRepository.create(
        {
          name: dto.accountName,
        },
        transaction,
      )

      await this.accountContactRepository.create(
        {
          accountId: account.id,
          name: dto.name,
          email: dto.email,
          phoneNumber: dto.phoneNumber,
        },
        transaction,
      )

      return true
    })
  }
}
