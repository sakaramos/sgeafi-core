import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AccountRegisterDto } from './account.dto.js'
import { AccountService } from './account.service.js'

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @HttpCode(201)
  async register(@Body() body: AccountRegisterDto): Promise<boolean> {
    return this.accountService.register(body)
  }
}
