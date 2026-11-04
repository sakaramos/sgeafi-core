import {
  AccountStatus,
  type Account,
  type AccountContact,
  type User,
} from '../../generated/prisma/index.js'

export const createMockAccountRegisterDto = (overrides = {}) => ({
  accountName: 'MyAccount',
  name: 'John Doe',
  phoneNumber: '3111111111',
  email: 'john.doe@gmail.com',
  password: 'johndoe-password',
  ...overrides,
})

export const createMockAccountData = (overrides: Partial<Account> = {}) => ({
  id: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  code: 1n,
  name: 'MyAccount',
  status: AccountStatus.INACTIVE,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
})

export const createMockAccountContactData = (overrides: Partial<AccountContact> = {}) => ({
  id: '3f1c0a2e-6b4d-4e8a-9c1f-2a7b5d8e0f11',
  accountId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  name: 'John Doe',
  email: 'john.doe@gmail.com',
  phoneNumber: '3111111111',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
})

export const createMockUserData = (overrides: Partial<User> = {}) => ({
  id: '9b2d4c6e-1a3f-4b8d-8e7c-5f0a1b2c3d4e',
  accountId: '7c9e6679-7425-40de-944b-e07fc1f90ae7',
  passwordHash: 'default-hashed-password',
  name: 'John Doe',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  ...overrides,
})
