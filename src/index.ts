#!/usr/bin/env node

import { program } from 'commander'
import { readConfig } from './config'
import * as path from 'path'

import serve from './serve'
import export_pdf from './export_pdf'
import export_epub from './export_epub'
import create from './create'

program
	.command('create <name>')
	.description('Create new boilerplate printshop project')
	.action(create)

try {
	const config = readConfig(path.join(process.cwd(), 'printshop.config.yaml'))
	
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
	
}

program.parse(process.argv)