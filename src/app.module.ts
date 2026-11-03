import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validate } from './config/validate.js'
import { AccountModule } from './modules/account/account.module.js'
import { HashModule } from './common/hash/hash.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    AccountModule,
    HashModule,
  ],
})
export class AppModule {}
