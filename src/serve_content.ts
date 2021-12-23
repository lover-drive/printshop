import * as fs from 'fs'
import * as pug from 'pug'
import { Application } from 'express'
import { Config } from './config'
import { isEmpty, complement as not, endsWith } from 'ramda'
import path = require('path')

function parseContent (content: string, config, base_indent = 0) {
	let isDefaultBlock = false

	return content
		.split('\n')
		.filter(not(isEmpty))
		.map(line => {
			if (line.slice(base_indent).startsWith('block')) {
				isDefaultBlock = false
				return `${'\t'.repeat(base_indent + 1)}${line}`
			}

			const indent = line
				.replace(/[^\t].*/g, '')
				.length

			if (line.slice(indent).startsWith('include')) {
				const filename = line.slice(indent + 'include '.length)
				const file = filename.startsWith('/') ? path.join(process.cwd(), config.base_dir, filename) : path.join(process.cwd(), config.base_dir, config.content.dir, filename)
				const con = fs.readFileSync(file.endsWith('.pug') ? file : file + '.pug').toString()
				return parseContent(con, config, indent)
			}

			if (!isDefaultBlock) {
				if (indent == 0) {
					isDefaultBlock = true
					return `block append content\n${'\t'.repeat(base_indent + 1)}${line}`
				}

				return `${'\t'.repeat(base_indent)}${line}`
			}
			return `${'\t'.repeat(base_indent + 1)}${line}`
		})
		.map(config.content.preprocess)
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

				res.send(pug.render(`extends /${template}\n${parseContent(fs.readFileSync(p).toString(), config)}`, {
					pretty: true,
					basedir: path.join(process.cwd(), config.base_dir),
					filename: p,
					...defaults,
					...req.query
				}))
			}

			app.get(`${url}/:path*`, (req, res) => {
				let p = path.join(process.cwd(), config.base_dir, config.content.dir, req.params['path'], req.params[0])
				do_serve(req, res, p)
			})
			
			app.get(`${url}`, (req, res) => {
				let p = path.join(process.cwd(), config.base_dir, config.content.dir)
				do_serve(req, res, p)
			})
		}
	)
}