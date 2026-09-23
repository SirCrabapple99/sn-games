import { jsxPlugin } from 'dreamland/vite';
/* import { viteSingleFile } from 'vite-plugin-singlefile'; */
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/sn-games/',
  plugins: [jsxPlugin()/* , viteSingleFile() */],
});
