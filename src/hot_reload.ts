import { Server as SocketIOServer } from 'socket.io'
import { watch } from 'chokidar'
import { Server } from 'http'
import { Config } from './config'
import path = require('path')

export default function hot_reload (server: Server, config: Config) {
	const io = new SocketIOServer(server)

	function emitReload () {
		io.emit('content-changed')
	}

	watch(path.join(process.cwd(), config.base_dir), { ignored: /^\./, ignoreInitial: true })
		.on('add', emitReload)
		.on('change', emitReload)
		.on('unlink', emitReload)
}