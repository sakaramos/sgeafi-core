import { Test, TestingModule } from '@nestjs/testing'
import { AccountController } from './account.controller.js'
import { AccountService } from './account.service.js'
import { AccountRegisterDto } from './account.dto.js'
import { createMockAccountRegisterDto } from '../../helpers/data.mock.js'
import { createMockAccountService } from '../../helpers/service.mock.js'

describe('accountController', () => {
  let controller: AccountController
  let mockAccountService: ReturnType<typeof createMockAccountService>

  beforeEach(async () => {
    mockAccountService = createMockAccountService()

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [
        {
          provide: AccountService,
          useValue: mockAccountService,
        },
      ],
    }).compile()

    controller = module.get<AccountController>(AccountController)

    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should call AccountService.register', async () => {
      const dto = createMockAccountRegisterDto()

      const result = await controller.register(dto as AccountRegisterDto)

      expect(mockAccountService.register).toHaveBeenCalledWith(dto)
      expect(result).toBe(true)
    })
  })
})
