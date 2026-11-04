import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { validate } from './config/validate.js'
import { AccountModule } from './modules/account/account.module.js'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      skipIf: () => process.env.NODE_ENV === 'test',
      throttlers: [{ ttl: 60_000, limit: 10 }],
    }),
    AccountModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
