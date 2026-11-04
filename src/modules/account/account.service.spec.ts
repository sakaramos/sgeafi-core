import { Test, TestingModule } from '@nestjs/testing'

import { HashService } from '../../common/hash/hash.service.js'
import { PrismaService } from '../../database/prisma.service.js'
import { createMockAccountData, createMockAccountRegisterDto } from '../../helpers/data.mock.js'
import {
  createMockAccountContactRepository,
  createMockAccountRepository,
  createMockHashService,
} from '../../helpers/service.mock.js'
import { AccountContactRepository } from '../accountContact/accountContact.repository.js'
import { AccountRepository } from './account.repository.js'
import { AccountService } from './account.service.js'

describe('AccountService', () => {
  let service: AccountService
  let mockHashService: ReturnType<typeof createMockHashService>
  let mockAccountRepository: ReturnType<typeof createMockAccountRepository>
  let mockAccountContactRepository: ReturnType<typeof createMockAccountContactRepository>
  const transaction = {}

  beforeEach(async () => {
    mockHashService = createMockHashService()
    mockAccountRepository = createMockAccountRepository()
    mockAccountContactRepository = createMockAccountContactRepository()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: (operation: (transaction: object) => Promise<boolean>) =>
              operation(transaction),
          },
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
        {
          provide: AccountRepository,
          useValue: mockAccountRepository,
        },
        {
          provide: AccountContactRepository,
          useValue: mockAccountContactRepository,
        },
      ],
    }).compile()

    service = module.get<AccountService>(AccountService)

    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should process and complete the account registration flow successfully', async () => {
      const mockDto = createMockAccountRegisterDto()

      const result = await service.register(mockDto)

      expect(mockHashService.hash).toHaveBeenCalledWith(mockDto.password)
      expect(mockAccountRepository.create).toHaveBeenCalledWith(
        { name: mockDto.accountName },
        transaction,
      )
      expect(mockAccountContactRepository.create).toHaveBeenCalledWith(
        {
          accountId: createMockAccountData().id,
          name: mockDto.name,
          email: mockDto.email,
          phoneNumber: mockDto.phoneNumber,
        },
        transaction,
      )
      expect(result).toBe(true)
    })
  })
})
