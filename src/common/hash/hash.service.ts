import { PasswordHasher } from '@nestjs/authentication'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HashService {
  private readonly passwordHasher = new PasswordHasher(
    process.env.NODE_ENV === 'test' ? { logN: 10 } : undefined,
  )

  async hash(value: string) {
    return this.passwordHasher.hash(value)
  }
}
