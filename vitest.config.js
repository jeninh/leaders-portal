import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
	test: {
		include: ['tests/**/*.test.js'],
		environment: 'node'
	},
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
			'$lib/server': path.resolve('./src/lib/server'),
			'$env/dynamic/private': path.resolve('./tests/mocks/env.js'),
			'$app/stores': path.resolve('./tests/mocks/stores.js')
		}
	}
});
