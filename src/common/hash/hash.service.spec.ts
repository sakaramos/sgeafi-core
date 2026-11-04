import { Test, TestingModule } from '@nestjs/testing'

import { HashService } from './hash.service.js'

describe('HashService', () => {
  let service: HashService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile()

    service = module.get(HashService)
  })

  describe('hash', () => {
    it('should hash the password with scrypt', async () => {
      const plainText = 'my-secret-password'

      const result = await service.hash(plainText)

      expect(result.startsWith('$scrypt$')).toBe(true)
      expect(result).not.toBe(plainText)
    })
  })
})
