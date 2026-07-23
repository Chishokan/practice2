/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // domain/ の純粋関数のみを対象にする（UIテストは書かない方針）
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
