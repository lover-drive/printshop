import * as fs from 'fs'
import * as pug from 'pug'
import { Application } from 'express'
import { Config } from './config'
import { isEmpty, complement as not } from 'ramda'
import path = require('path')

function parseContent (content: string) {
	let isDefaultBlock = false

	return content
		.split('\n')
		.filter(not(isEmpty))
		.map(line => {
			if (line.startsWith('block')) {
				isDefaultBlock = false
				return line
			}

			const indent = line
				.replace(/[^\t].*/g, '')
				.length

			if (!isDefaultBlock) {
				if (indent == 0) {
					isDefaultBlock = true
					return `block append content\n\t${line}`
				}

				return line
			}
			return `\t${line}`
		})
		.join('\n')
}

export function serve_content (app: Application, config: Config) {
	config.templates.forEach(
		({ url, template, defaults }) => {
			function do_serve(req, res, p) {
				if (fs.statSync(p).isDirectory) p = path.join(p, 'index.pug')

				Object.keys(req.query)
					.forEach(_ => {
						try {
							req.query[_] = JSON.parse(req.query[_] as string)
						} catch {

						}
					})

				res.send(pug.render(`extends /${template}\n${parseContent(fs.readFileSync(p).toString())}`, {
					pretty: true,
					basedir: path.join(process.cwd(), config.base_dir),
					filename: p,
					...defaults,
					...req.query
				}))
			}

			app.get(`${url}/:path*`, (req, res) => {
				let p = path.join(process.cwd(), config.content_dir, req.params['path'], req.params[0])
				do_serve(req, res, p)
			})
			
			app.get(`${url}`, (req, res) => {
				let p = path.join(process.cwd(), config.content_dir)
				do_serve(req, res, p)
			})
		}
	)
}