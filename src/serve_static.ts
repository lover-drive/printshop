import * as express from 'express'
import { readFile } from 'fs/promises'
import path = require('path')
import { toString } from 'ramda'
import { Config } from './config'

export default function serve_static (app: express.Application, config: Config) {
	for (let s of config.static) {
		if (!s.preprocess) app.use(s.url, express.static(s.dir))
		else app.get(`${s.url}/:path*`, (req, res) => {
			const p = path.join(process.cwd(), s.dir, req.params['path'], req.params[0])
			readFile(p)
				.then(async _ => await s.preprocess(_, p))
				.then(res.send.bind(res))
		})
	}
}