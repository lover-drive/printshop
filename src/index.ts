#!/usr/bin/env node

import { program } from 'commander'
import * as path from 'path'
import * as fs from 'fs'

import serve from './serve'
import export_pdf from './export_pdf'
import export_epub from './export_epub'
import create from './create'

program
	.command('create <name>')
	.description('Create new boilerplate printshop project')
	.action(create)

program
	.version(require('../version.js'))

try {
	const config = require('./config').default
	
	program
		.command('serve')
		.description('Run a dev server for preview')
		.action(serve(config))
	
	const c_export = program.command('export')
	
	c_export
		.command('pdf [url]')
		.description('Export content to .pdf file')
		.action(export_pdf(config))
	
	c_export
		.command('epub [url]')
		.description('Export content to .epub file')
		.action(export_epub(config))
} catch (e) {
	console.error(e)
}

program.parse(process.argv)