import { jsxPlugin } from 'dreamland/vite';
/* import { viteSingleFile } from 'vite-plugin-singlefile'; */
import { defineConfig } from 'vite';

const coi = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
};

export default defineConfig({
  base: '/sn-games/',
  server: { headers: coi },
  preview: { headers: coi },
  plugins: [jsxPlugin() /* , viteSingleFile() */],
});