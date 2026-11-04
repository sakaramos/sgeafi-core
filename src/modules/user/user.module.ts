import { Module } from '@nestjs/common'

import { DatabaseModule } from '../../database/database.module.js'
import { UserRepository } from './user.repository.js'

@Module({
  providers: [UserRepository],
  imports: [DatabaseModule],
  exports: [UserRepository],
})
export class UserModule {}
