import { execSync } from 'child_process'

export default function create (name: string) {
	execSync(`git clone https://github.com/lover-drive/printshop_starter.git ${name}`)
	execSync(`cd ${name} && git remote rm origin`)
}