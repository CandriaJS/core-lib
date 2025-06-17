import { Command } from 'commander'

import { init } from '@/cli/init'
import { pkg } from '@/cli/version'
const program = new Command()

program.version(pkg.version, '-v, --version', '显示Cli版本号')

// program
//   .helpOption(false)

program
  .option('-h, --help', '显示帮助信息')

program
  .command('init')
  .description('初始化项目')
  .action(() => {
    init()
  })

program.parse(process.argv)
