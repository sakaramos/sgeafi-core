import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Injectable()
export class HashService {
  private readonly saltRounds = 10

  async hash(value: string) {
    return await bcrypt.hash(value, this.saltRounds)
  }
}
