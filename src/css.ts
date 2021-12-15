import { Config } from './config'
import * as path_utils from 'path'

import { Processor } from 'postcss'
import { compile } from 'sass'

export default function process_css(path: string, config: Config) {
	const postprocessor = new Processor(
		config.styles.postcss_plugins.map(_ => require(path_utils.join(process.cwd(), 'node_modules', _)))
	)

	return postprocessor.process(compile(path).css, { from: undefined })
		.then(_ => _.css)
}