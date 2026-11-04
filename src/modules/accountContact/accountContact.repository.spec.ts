import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'

import { Prisma } from '../../../generated/prisma/index.js'
import { PrismaService } from '../../database/prisma.service.js'
import { createMockAccountContactData } from '../../helpers/data.mock.js'
import { createMockPrismaService } from '../../helpers/service.mock.js'
import { AccountContactRepository } from './accountContact.repository.js'

describe('AccountContactRepository', () => {
  let repository: AccountContactRepository
  let mockPrismaService: ReturnType<typeof createMockPrismaService>

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountContactRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    repository = module.get(AccountContactRepository)

    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should complete the account contact registration correctly', async () => {
      const mockAccountContactData = createMockAccountContactData()

      const result = await repository.create({
        accountId: mockAccountContactData.accountId,
        name: mockAccountContactData.name,
        email: mockAccountContactData.email,
        phoneNumber: mockAccountContactData.phoneNumber,
      })

      expect(mockPrismaService.accountContact.create).toHaveBeenCalledWith({
        data: {
          accountId: mockAccountContactData.accountId,
          name: mockAccountContactData.name,
          email: mockAccountContactData.email,
          phoneNumber: mockAccountContactData.phoneNumber,
        },
      })
      expect(result).toEqual(mockAccountContactData)
    })

    it('should throw a conflict when the email is already registered', async () => {
      mockPrismaService.accountContact.create.mockRejectedValueOnce(
        new Prisma.PrismaClientKnownRequestError(
          'Unique constraint failed on the fields: (`email`)',
          {
            code: 'P2002',
            clientVersion: '6.19.3',
            meta: { modelName: 'AccountContact', target: ['email'] },
          },
        ),
      )

      await expect(
        repository.create({
          accountId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          phoneNumber: '3111111111',
        }),
      ).rejects.toBeInstanceOf(ConflictException)
    })

    it('should throw a generic error when persisting the account contact fails', async () => {
      mockPrismaService.accountContact.create.mockRejectedValueOnce(
        new Error('database unavailable'),
      )

      await expect(
        repository.create({
          accountId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
          name: 'John Doe',
          email: 'john.doe@gmail.com',
          phoneNumber: '3111111111',
        }),
      ).rejects.toThrow('Failed to create account contact.')
    })
  })
})
