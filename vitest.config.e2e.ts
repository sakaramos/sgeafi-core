import { defineConfig, loadEnv } from 'vite'

export default defineConfig(() => {
  const env = loadEnv('test', process.cwd(), '')

  return {
    resolve: { tsconfigPaths: true },
    test: {
      globals: true,
      root: './',
      include: ['**/*.e2e-spec.ts'],
      fileParallelism: false,
      setupFiles: ['./test/setup-e2e.ts'],
      env: {
        NODE_ENV: 'test',
        PORT: env.PORT,
        DATABASE_URL: env.DATABASE_URL,
      },
    },
  }
})
