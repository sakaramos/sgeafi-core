import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

import { PrismaClient } from '../generated/prisma/index.js'
import { AppModule } from '../src/app.module.js'

describe('AccountModule', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('POST', () => {
    const validPayload = {
      accountName: 'MyAccount',
      name: 'John Doe',
      phoneNumber: '3111111111',
      email: 'john.doe@gmail.com',
      password: 'johndoe-password',
    }

    it('it should return 201 when the data is correct', () => {
      return request(app.getHttpServer()).post('/account').send(validPayload).expect(201)
    })

    const nonStringFields = ['accountName', 'name', 'phoneNumber', 'email', 'password']
    it.each(nonStringFields)('should return 400 when %s is not a string', (field) => {
      return request(app.getHttpServer())
        .post('/account')
        .send({ ...validPayload, [field]: 12345 })
        .expect(400)
    })

    const emptyFields = ['accountName', 'name', 'phoneNumber', 'email', 'password']
    it.each(emptyFields)('should return 400 when %s is empty', (field) => {
      return request(app.getHttpServer())
        .post('/account')
        .send({ ...validPayload, [field]: '' })
        .expect(400)
    })

    it('should return 400 when the password is too short', () => {
      return request(app.getHttpServer())
        .post('/account')
        .send({ ...validPayload, password: '1234567' })
        .expect(400)
    })

    const maxLengthCases = [
      ['accountName', 'a'.repeat(256)],
      ['name', 'a'.repeat(256)],
      ['phoneNumber', '1'.repeat(51)],
      ['password', 'a'.repeat(256)],
    ]
    it.each(maxLengthCases)('should return 400 when %s exceeds max length', (field, value) => {
      return request(app.getHttpServer())
        .post('/account')
        .send({ ...validPayload, [field]: value })
        .expect(400)
    })

    const invalidEmailCases = [
      ['email without @ symbol', 'johndoe.gmail.com'],
      ['email without domain', 'john@'],
      ['email with spaces', 'john doe@gmail.com'],
    ]
    it.each(invalidEmailCases)('should return 400 when %s', (_, invalidEmail) => {
      return request(app.getHttpServer())
        .post('/account')
        .send({ ...validPayload, email: invalidEmail })
        .expect(400)
    })

    it('should return 409 when the email is already registered', async () => {
      await request(app.getHttpServer()).post('/account').send(validPayload).expect(201)

      const response = await request(app.getHttpServer())
        .post('/account')
        .send(validPayload)
        .expect(409)

      expect(response.body.message).toBe('Email is already registered.')

      const prisma = new PrismaClient()
      expect(await prisma.account.count()).toBe(1)
      await prisma.$disconnect()
    })
  })
})
