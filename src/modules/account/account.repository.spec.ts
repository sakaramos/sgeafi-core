import { Test, TestingModule } from '@nestjs/testing'

import { PrismaService } from '../../database/prisma.service.js'
import { createMockAccountData } from '../../helpers/data.mock.js'
import { createMockPrismaService } from '../../helpers/service.mock.js'
import { AccountRepository } from './account.repository.js'

describe('AccountRepository', () => {
  let repository: AccountRepository
  let mockPrismaService: ReturnType<typeof createMockPrismaService>

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    repository = module.get(AccountRepository)

    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should complete the account registration correctly', async () => {
      const mockAccountData = createMockAccountData()

      const result = await repository.create({ name: mockAccountData.name })

      expect(mockPrismaService.account.create).toHaveBeenCalledWith({
        data: {
          name: mockAccountData.name,
        },
      })
      expect(result).toEqual(mockAccountData)
    })

    it('should throw a generic error when persisting the account fails', async () => {
      mockPrismaService.account.create.mockRejectedValueOnce(new Error('database unavailable'))

      await expect(repository.create({ name: 'MyAccount' })).rejects.toThrow(
        'Failed to create account.',
      )
    })
  })
})
