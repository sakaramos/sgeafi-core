import type { Account, AccountContact } from '../../generated/prisma/index.js'
import { PrismaService } from '../database/prisma.service.js'
import { AccountRegisterDto } from '../modules/account/account.dto.js'
import type { AccountCreateDto } from '../modules/account/account.repository.js'
import type { AccountContactCreateDto } from '../modules/accountContact/accountContact.repository.js'
import { createMockAccountContactData, createMockAccountData } from './data.mock.js'

export const createMockAccountService = (): {
  register: (data: AccountRegisterDto) => Promise<boolean>
} => ({
  register: vi.fn().mockResolvedValue(true),
})

export const createMockPrismaService = (): {
  account: {
    create: (data: PrismaService) => Promise<Account>
  }
  accountContact: {
    create: (data: AccountContactCreateDto) => Promise<AccountContact>
  }
} => ({
  account: {
    create: vi.fn().mockResolvedValue(createMockAccountData()),
  },
  accountContact: {
    create: vi.fn().mockResolvedValue(createMockAccountContactData()),
  },
})

export const createMockHashService = (): {
  hash: (value: string) => Promise<string>
} => ({
  hash: vi.fn().mockResolvedValue('default-hashed-password'),
})

export const createMockAccountRepository = (): {
  create: (data: AccountCreateDto) => Promise<Account>
} => ({
  create: vi.fn().mockResolvedValue(createMockAccountData()),
})

export const createMockAccountContactRepository = (): {
  create: (data: AccountContactCreateDto) => Promise<AccountContact>
} => ({
  create: vi.fn().mockResolvedValue(createMockAccountContactData()),
})
