import { parse } from 'yaml'
import { readFileSync } from 'fs'

export type Config = {
	name?: string,
	description?: string,
	author?: string,

	base_dir?: string,
	content_dir: string,

	static: {
		dir: string,
		url: string
	}[],

	styles: {
		dir: string,
		url: string,
		postcss_plugins: string[]
	},

	templates: {
		url: string,
		template: string,
		defaults: {
			[key: string]: any
		}
	}[]

	pdf?: {
		default_url: string,
		generate_bookmarks: boolean
	},

	epub?: {
		css: string,
		default_url: string,
		fonts: string[],
		lang: string,
	},

	static_html?: {
		default_template: string,
		include: string[]
	},

	puppeteer?: {
		browser: 'chrome' | 'firefox',
		revision: string,
		extra_pdf?: any
	},


	dev_port: number
}

const default_config: Config = {
	base_dir: '.',
	content_dir: null,
	static: [],
	styles: {
		postcss_plugins: []
	} as any,
	templates: [],
	pdf: null,
	static_html: null,
	epub: null,
	puppeteer: null,

	dev_port: 8080
}

export function validateConfig (config: Config) {
	const missing_property = property => new Error(`Config is missing ${property} property`)

	if (!config.content_dir) throw missing_property('content_dir')

	if (!config.styles) throw missing_property(`styles`)
	if (!config.styles.dir) throw missing_property(`styles.dir`)
	if (!config.styles.url) throw missing_property(`styles.url`)

	if (!config.templates) throw missing_property(`templates`)
	if (config.templates.length == 0) throw new Error('No templates defined')

	return config
}

export function readConfig (configPath: string) {
	return Object.assign(
		{},
		default_config,
		validateConfig(parse(readFileSync(configPath).toString()))
	)
}