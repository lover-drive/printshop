import * as express from 'express'
import { Config } from './config'

export default function serve_static (app: express.Application, config: Config) {
	config.static.forEach(_ => app.use(_.url, express.static(_.dir)))
}