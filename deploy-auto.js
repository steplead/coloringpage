#!/usr/bin/env node

const { execSync } = require('child_process');

/**
 * 执行命令行命令并打印输出
 * @param {string} command 要执行的命令
 */
function runCommand(command) {
  console.log(`执行: ${command}`);
  try {
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`命令执行错误: ${error.message}`);
    console.error(error.stdout);
    console.error(error.stderr);
    process.exit(1);
  }
}

/**
 * 主函数 - 自动执行部署流程
 */
async function autoDeploy() {
  console.log('🚀 开始自动部署流程...');
  
  // 1. 检查git状态
  console.log('📊 检查Git状态...');
  const status = runCommand('git status --porcelain');
  
  if (!status.trim()) {
    console.log('没有检测到更改，无需部署');
    process.exit(0);
  }
  
  // 获取当前日期和时间作为提交信息的一部分
  const now = new Date();
  const commitMessage = `自动更新应用程序 - ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
  
  // 2. 添加所有文件到git
  console.log('📁 添加文件到Git...');
  runCommand('git add .');
  
  // 3. 提交更改
  console.log('💾 提交更改...');
  runCommand(`git commit -m "${commitMessage}"`);
  
  // 4. 推送到远程仓库
  console.log('☁️ 推送到远程仓库...');
  runCommand('git push origin main');
  
  // 5. 使用Vercel CLI部署
  console.log('🌐 部署到Vercel...');
  runCommand('npx vercel --prod --yes'); // 加上--yes参数以自动确认所有提示
  
  console.log('✅ 部署完成！');
}

// 执行部署流程
autoDeploy().catch(err => {
  console.error('部署过程中发生错误:', err);
  process.exit(1);
}); 