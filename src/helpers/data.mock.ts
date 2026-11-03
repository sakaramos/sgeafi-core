export const createMockAccountRegisterDto = (overrides = {}) => ({
  accountName: 'MyAccount',
  name: 'John Doe',
  phoneNumber: '3111111111',
  email: 'john.doe@gmail.com',
  password: 'johndoe-password',
  ...overrides,
})
