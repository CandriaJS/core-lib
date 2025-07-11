function readPackage (pkg, context) {
  /**
   * 删除scripts列表 阻止钩子执行 开发环境不需要执行钩子
   */
  const map = [
    'sqlite3',
    '@candriajs/sqlite3',
  ]

  if (map.includes(pkg.name)) {
    pkg.scripts = {}
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}