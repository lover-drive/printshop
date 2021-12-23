import { mergeDeepRight } from 'ramda'
import path = require('path')

export type Config = {
	name?: string,
	description?: string,
	author?: string,

	base_dir: string,

	content: {
		dir: string,
		preprocess (line: string): string
	},

	static: {
		dir: string,
		url: string,
		preprocess (input: Buffer, path: string): string
	}[],

	templates: {
		url: string,
		template: string,
		defaults: {
			[key: string]: any
		}
	}[],

	export: {
		pdf?: {
			default_url: string,
			generate_bookmarks: boolean,
		},
		epub?: {
			css: string,
			default_url: '/web'
		},
		html?: {
			template: string,
			include: string[]
		}
	},

	puppeteer?: {
		browser: 'chrome' | 'firefox',
		revision: string,
		pdf_export?: any
	},

	dev_port: number
}

const default_config = {
	base_dir: '.',
	content: {
		dir: 'content',
		preprocess: _ => _
	},
	static: [],
	templates: [],
	export: {},
	puppeteer: null,
	dev_port: 8080
}

export default mergeDeepRight(
	default_config,
	require(path.resolve('printshop.config.js'))
) as unknown as Config