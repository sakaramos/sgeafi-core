export const createMockAccountService = () => ({
  register: vi.fn().mockResolvedValue(true),
})

export const createMockHashService = () => ({
  hash: vi.fn().mockResolvedValue('default-hashed-password'),
})
