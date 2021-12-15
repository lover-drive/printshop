import { ElementHandle, Page, Browser } from 'puppeteer'
import * as puppeteer from 'puppeteer'
import path = require('path')
import { writeFileSync } from 'fs'
import * as epub from 'epub-gen'
import { Config } from './config';
import { runServer } from './serve';
import process_css from './css'

export default function export_epub (config: Config) {
	return async (url) => {
		const server = runServer(config)

		const browser = await puppeteer.launch({ headless: true })
		const page = await browser.newPage()
		await page.goto(`http://localhost:${config.dev_port}${url || config.epub.default_url}`, {
			waitUntil: 'networkidle0'
		})

		const content = await page.evaluate(() => {
			const chapters = []
			let currentChapter = ''
			document.querySelectorAll('h2, h2 ~ *')
				.forEach(el => {
					if (el.tagName == 'H2') {
						chapters.push({
							title: el.textContent,
							data: ''
						})
					} else chapters[chapters.length - 1].data += el.outerHTML
				})

			return chapters
		})

		await new epub({
			title: config.name,
			author: config.author,
			output: path.join(process.cwd(), `./output/${config.name || 'output'}.epub`),
			css: await process_css(path.join(process.cwd(), config.epub.css), config),
			content
		}).promise
		
		process.exit()
	}
}