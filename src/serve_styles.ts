import * as express from 'express'
import * as path from 'path'
import { Config } from './config'

import { Processor } from 'postcss'
import { compile } from 'sass'

export default function serve_styles(app: express.Application, config: Config) {
	const postprocessor = new Processor(
		config.styles.postcss_plugins.map(_ => require(path.join(process.cwd(), 'node_modules', _)))
	)
	
	app.get(`${config.styles.url}/:path*`, (req, res) => {
		const p = path.join(process.cwd(), config.styles.dir, req.params['path'], req.params[0])

		postprocessor.process(compile(p).css, { from: undefined })
			.then(_ => {
				res.header('Content-Type', 'text/css')
				res.end(_.css)
			})
			.catch(e => {
				res.statusCode = 500
				res.header('Content-Type', 'text/txt')
				res.end(e.toString())
			})
	})

}