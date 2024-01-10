import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$components: '/src/components',
			$lib: '/src/lib',
			// $stores: '/src/stores',
			// $styles: '/src/styles',
			// $utils: '/src/utils',
		},
	},
});
