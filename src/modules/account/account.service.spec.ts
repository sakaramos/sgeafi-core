import { Test, TestingModule } from '@nestjs/testing'
import { AccountService } from './account.service.js'
import { HashService } from '../../common/hash/hash.service.js'
import { createMockHashService } from '../../helpers/service.mock.js'
import { createMockAccountRegisterDto } from '../../helpers/data.mock.js'

describe('AccountService', () => {
  let service: AccountService
  let mockHashService: ReturnType<typeof createMockHashService>

  beforeEach(async () => {
    mockHashService = createMockHashService()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: HashService,
          useValue: mockHashService,
        },
      ],
    }).compile()

    service = module.get<AccountService>(AccountService)

    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should return true when registering successfully', async () => {
      const dto = createMockAccountRegisterDto()

      const result = await service.register(dto)

      expect(mockHashService.hash).toHaveBeenCalledWith(dto.password)
      expect(result).toBe(true)
    })
  })
})
