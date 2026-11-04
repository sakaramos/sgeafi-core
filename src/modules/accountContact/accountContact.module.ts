import { Module } from '@nestjs/common'

import { DatabaseModule } from '../../database/database.module.js'
import { AccountContactRepository } from './accountContact.repository.js'

@Module({
  providers: [AccountContactRepository],
  imports: [DatabaseModule],
  exports: [AccountContactRepository],
})
export class AccountContactModule {}
