import { Test, TestingModule } from '@nestjs/testing'

import { createMockAccountRegisterDto } from '../../helpers/data.mock.js'
import { createMockAccountService } from '../../helpers/service.mock.js'
import { AccountController } from './account.controller.js'
import { AccountService } from './account.service.js'

describe('AccountController', () => {
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

    controller = module.get(AccountController)

    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should call the account service and process the registration successfully', async () => {
      const mockDto = createMockAccountRegisterDto()

      const result = await controller.register(mockDto)

      expect(mockAccountService.register).toHaveBeenCalledWith(mockDto)
      expect(result).toBe(true)
    })
  })
})
