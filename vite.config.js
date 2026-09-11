import { jsxPlugin } from 'dreamland/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/sn-games/',
  plugins: [jsxPlugin()],
});
