import { exec as execCmd, execSync as execSyncCmd } from 'node:child_process'

import type { ExecOptions, ExecReturn } from '@/exec/types'

/**
 * 异步执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 * @example
 * ```ts
 * const { status, error, stdout, stderr } = await exec('ls -al')
 * // -> { status: true, error: null, stdout: '...', stderr: '...' }
 *
 * const status = await exec('ls -al', { booleanResult: true })
 * // -> true
 *
 * const { status, error, stdout, stderr } = await exec('ls -al', { log: true })
 * // -> 打印执行命令和结果
 * ```
 */
export function exec<T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): Promise<ExecReturn<T>> {
  const logger = console
  return new Promise((resolve) => {
    if (options?.log) {
      logger.info([
        '[exec] 执行命令:',
        `pwd: ${options?.cwd ?? process.cwd()}`,
        `cmd: ${cmd}`,
        `options: ${JSON.stringify(options)}`
      ].join('\n'))
    }

    execCmd(cmd, options, (error, stdout, stderr) => {
      if (options?.log) {
        const info = error as Error
        if (info.message) info.message = `\x1b[91m${info.message}\x1b[0m`
        logger.info([
          '[exec] 执行结果:',
          `stderr: ${stderr.toString()}`,
          `stdout: ${stdout.toString()}`,
          `error: ${JSON.stringify(info, null, 2)}`
        ].join('\n'))
      }

      if (options?.booleanResult) {
        return resolve((!error) as ExecReturn<T>)
      }

      stdout = stdout.toString()
      stderr = stderr.toString()

      if (options?.trim) {
        stdout = stdout.trim()
        stderr = stderr.trim()
      }

      const value = {
        status: !error,
        error,
        stdout,
        stderr
      } as ExecReturn<T>
      resolve(value)
    })
  })
}

/**
 * 同步执行 shell 命令
 * @param cmd 命令
 * @param options 选项
 * @param options.log 是否打印日志 默认不打印
 * @param options.booleanResult 是否只返回布尔值 表示命令是否成功执行 默认返回完整的结果
 * @example
 * ```ts
 * const { status, error, stdout, stderr } = execSync('ls -al')
 * // -> { status: true, error: null, stdout: '...', stderr: '...' }
 *
 * const status = execSync('ls -al', { booleanResult: true })
 * // -> true
 *
 * const { status, error, stdout, stderr } = execSync('ls -al', { log: true })
 * // -> 打印执行命令和结果
 * ```
 */
export function execSync<T extends boolean = false> (
  cmd: string,
  options?: ExecOptions<T>
): ExecReturn<T> {
  const logger = console
  if (options?.log) {
    logger.info([
      '[exec] 执行命令:',
      `pwd: ${options?.cwd ?? process.cwd()}`,
      `cmd: ${cmd}`,
      `options: ${JSON.stringify(options)}`
    ].join('\n'))
  }

  try {
    const stdout = execSyncCmd(cmd, options).toString()
    const stderr = ''

    if (options?.log) {
      logger.info([
        '[exec] 执行结果:',
        `stderr: ${stderr}`,
        `stdout: ${stdout}`,
        'error: null'
      ].join('\n'))
    }

    if (options?.booleanResult) {
      return true as ExecReturn<T>
    }

    return {
      status: true,
      error: null,
      stdout: options?.trim ? stdout.trim() : stdout,
      stderr: options?.trim ? stderr.trim() : stderr
    } as ExecReturn<T>
  } catch (error) {
    if (options?.log) {
      const info = error as Error
      if (info.message) info.message = `\x1b[91m${info.message}\x1b[0m`
      logger.info([
        '[exec] 执行结果:',
        `error: ${JSON.stringify(info, null, 2)}`
      ].join('\n'))
    }

    if (options?.booleanResult) {
      return false as ExecReturn<T>
    }

    return {
      status: false,
      error: error as Error,
      stdout: '',
      stderr: ''
    } as ExecReturn<T>
  }
}
