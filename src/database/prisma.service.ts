import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'

import { PrismaClient } from '../../generated/prisma/index.js'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
