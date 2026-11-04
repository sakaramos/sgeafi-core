import { Module } from '@nestjs/common'

import { HashModule } from '../../common/hash/hash.module.js'
import { DatabaseModule } from '../../database/database.module.js'
import { AccountContactModule } from '../accountContact/accountContact.module.js'
import { UserModule } from '../user/user.module.js'
import { AccountController } from './account.controller.js'
import { AccountRepository } from './account.repository.js'
import { AccountService } from './account.service.js'

@Module({
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  imports: [DatabaseModule, HashModule, AccountContactModule, UserModule],
})
export class AccountModule {}
