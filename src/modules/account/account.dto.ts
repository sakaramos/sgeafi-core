import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Transform } from 'class-transformer'

export class AccountRegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  accountName!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @IsPhoneNumber('CO')
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  phoneNumber!: string

  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  password!: string
}
