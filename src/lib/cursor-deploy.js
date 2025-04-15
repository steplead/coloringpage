/**
 * Cursor自动部署脚本
 * 使用方法：在Cursor中执行命令 cursor-deploy
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { spawnSync } = require('child_process');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// 获取项目根目录路径
const projectRoot = path.resolve(__dirname, '../../');

// 定义可执行的部署命令
const COMMANDS = {
  // 交互式部署（带提示）
  deploy: {
    command: 'npm',
    args: ['run', 'deploy'],
    description: '交互式部署（会提示输入提交信息）'
  },
  // 全自动部署（无需交互）
  autoDeploy: {
    command: 'npm',
    args: ['run', 'deploy:auto'],
    description: '全自动部署（无需交互，自动提交并发布）'
  }
};

/**
 * 执行部署命令
 * @param {string} type 部署类型：'deploy' 或 'autoDeploy'
 */
function executeDeploy(type = 'autoDeploy') {
  if (!COMMANDS[type]) {
    console.error(`未知的部署类型: ${type}`);
    process.exit(1);
  }

  const { command, args, description } = COMMANDS[type];
  console.log(`执行${description}...`);

  // 使用spawnSync以便在控制台中显示实时输出
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit', // 将子进程的标准输入输出流与父进程连接
    shell: true
  });

  if (result.error) {
    console.error('部署过程中发生错误:', result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`部署失败，退出码: ${result.status}`);
    process.exit(result.status);
  }

  console.log('部署成功完成！');
}

// 如果脚本被直接运行
if (require.main === module) {
  // 从命令行参数获取部署类型
  const deployType = process.argv[2] || 'autoDeploy';
  executeDeploy(deployType);
}

// 导出函数以便可以从其他模块调用
module.exports = {
  deploy: () => executeDeploy('deploy'),
  autoDeploy: () => executeDeploy('autoDeploy')
}; 