import { Config } from './config'
import * as express from 'express'
import * as path from 'path'

import { Server } from 'socket.io'
import { createServer } from 'http'

import serve_static from './serve_static'
import serve_styles from './serve_styles'
import { serve_content } from './serve_content'
import hot_reload from './hot_reload'

export function runServer (config: Config) {
	const app = express()

	app.get('/', (req, res) => {
		res.send('WTF')
	})

	serve_static(app, config)
	serve_styles(app, config)
	serve_content(app, config)


	const server = createServer(app)
	hot_reload(server, config)

	server.listen(config.dev_port, () => {})

	return server
}


export default function serve (config: Config) {
	return () => {
		runServer(config)
		console.log(`Running printshop:`)
		config.templates.forEach(
			_ => console.log(`http://localhost:${config.dev_port}${_.url}`)
		)
	}
}