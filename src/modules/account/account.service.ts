import { Injectable } from '@nestjs/common'
import { AccountRegisterDto } from './account.dto.js'
import { HashService } from '../../common/hash/hash.service.js'

@Injectable()
export class AccountService {
  constructor(private readonly hash: HashService) {}

  async register(dto: AccountRegisterDto): Promise<boolean> {
    await this.hash.hash(dto.password)

    return true
  }
}
