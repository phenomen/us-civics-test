import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import svgSprite from 'rollup-plugin-stdf-icon';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		svgSprite([{ inFile: 'src/lib/symbol', outFile: 'static/fonts', fileName: 'symbol' }]),
		tailwindcss(),
		sveltekit()
	]
});
