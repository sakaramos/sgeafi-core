import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

beforeEach(async () => {
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE "account_contacts", "users", "accounts" RESTART IDENTITY CASCADE',
  )
})

afterAll(async () => {
  await prisma.$disconnect()
})
