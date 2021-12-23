import { ElementHandle, Page, Browser } from 'puppeteer'
import { exec } from 'child_process'
import * as puppeteer from 'puppeteer'
import path = require('path')
import { writeFileSync } from 'fs'
import { Config } from './config'
import { runServer } from './serve'

import * as os from 'os'

export default function export_pdf (config: Config) {

	
	return async (url) => {
		runServer(config)

		let browser: puppeteer.Browser = null

		if (config.puppeteer) {
			if (config.puppeteer.browser == 'firefox') console.log('\x1b[33m%s\x1b[0m', 'WARNING: You\'re using Firefox as the printshop backend. Make sure that you\'ve specified puppeteer.extra_pdf.format property in your config.yaml, as Firefox ignores @page CSS rule.')

			const fetcher: puppeteer.BrowserFetcher = (puppeteer as any).createBrowserFetcher({
				product: config.puppeteer.browser
			})
	
			const fetcher_data = await fetcher.download(config.puppeteer.revision)
			browser = await puppeteer.launch({
				headless: true,

				product: fetcher_data.product as any,
				executablePath: fetcher_data.executablePath
			})

		} else {
			browser = await puppeteer.launch({ headless: true })
		}

		const page = await browser.newPage()
		await page.goto(`http://localhost:${config.dev_port}${url || config.export.pdf.default_url}`)
		await page.waitForTimeout(10000)

		const filePath = path.join(os.tmpdir(), `${config.name || 'output'}.pdf`)

		const pdfmarks = await page.evaluate(() => {
			const toHex = (s: string) => Array.from(s)
				.map(_ => _.charCodeAt(0).toString(16))
				.map(_ => _.padStart(4, '0'))
				.join('')

			function getTargetPage(a) {
				const target = document.querySelector(a.getAttribute('href'))
				return Number.parseInt(window.getComputedStyle(target).getPropertyValue('--page-number').replace(/\D/g, ''))
			}

			const anchors = Array.from(document.querySelectorAll('a[data-depth]'))
				.map((a: HTMLAnchorElement) => ({
					depth: Number.parseInt(a.getAttribute('data-depth')),
					text: a.innerText,
					pageNumber: getTargetPage(a),
					count: 0
				}))

			for (let i = 0; i < anchors.length; i++) {
				const a = anchors[i]
				for (let next of anchors.slice(i + 1)) {
					if (next.depth == a.depth + 1) a.count++

					if (next.depth <= a.depth) break
				}
			}

			document.body.setAttribute('data-pdfmarks', anchors.map(a => `[/Count ${a.count} /Title <FEFF${toHex(a.text)}> /Page ${a.pageNumber} /OUT pdfmark`).join('\n'))

			return anchors.map(a => `[/Count ${a.count} /Title <FEFF${toHex(a.text)}> /Page ${a.pageNumber} /OUT pdfmark`).join('\n')
		})

		const pdfmarks_path = path.join(os.tmpdir(), `pdfmarks.pdf`)

		writeFileSync(pdfmarks_path, pdfmarks)

		await page.pdf({
			margin: {
				bottom: 0,
				top: 0,
				left: 0,
				right: 0
			},
			preferCSSPageSize: true,
			path: filePath,
			printBackground: true,
			...config.puppeteer?.pdf_export || {}
		})

		postprocess_pdf(path.resolve(filePath), pdfmarks_path, config)
	}
}

function postprocess_pdf (file_path: string, pdfmarks: string, config: Config) {
	const gs_path = path.join(
		__dirname,
		'../cli-utils',
		process.platform == 'win32' ? 'gswin64.exe' : 'gs-9550-linux-x86_64'
	)
	return new Promise<string>((resolve, reject) => {
		exec([
			gs_path,
			'-dBATCH',
			'-dNOPAUSE',
			'-sDEVICE=pdfwrite',
			`-sOutputFile="output/${config.name}.pdf"`,
			`"${file_path}"`,
			pdfmarks
		].join(' '), (error, stdout, stderr) => {
			if (error) {
				console.error(error)
			}
			process.exit()
		})
	})
}