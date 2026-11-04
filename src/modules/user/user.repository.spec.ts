import { Test, TestingModule } from '@nestjs/testing'

import { PrismaService } from '../../database/prisma.service.js'
import { createMockUserData } from '../../helpers/data.mock.js'
import { createMockPrismaService } from '../../helpers/service.mock.js'
import { UserRepository } from './user.repository.js'

describe('UserRepository', () => {
  let repository: UserRepository
  let mockPrismaService: ReturnType<typeof createMockPrismaService>

  beforeEach(async () => {
    mockPrismaService = createMockPrismaService()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    repository = module.get(UserRepository)

    vi.clearAllMocks()
  })

  describe('create', () => {
    it('should persist and return the created user', async () => {
      const mockUserData = createMockUserData()

      const result = await repository.create({
        accountId: mockUserData.accountId,
        passwordHash: mockUserData.passwordHash,
        name: mockUserData.name,
      })

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          accountId: mockUserData.accountId,
          passwordHash: mockUserData.passwordHash,
          name: mockUserData.name,
        },
      })
      expect(result).toEqual(mockUserData)
    })

    it('should throw a generic error when persisting the user fails', async () => {
      mockPrismaService.user.create.mockRejectedValueOnce(new Error('database unavailable'))

      await expect(
        repository.create({
          accountId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
          passwordHash: 'default-hashed-password',
          name: 'John Doe',
        }),
      ).rejects.toThrow('Failed to create user.')
    })
  })
})
