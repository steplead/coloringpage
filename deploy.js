#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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
 * 主函数 - 执行部署流程
 */
async function deploy() {
  console.log('🚀 开始自动部署流程...');
  
  // 1. 检查git状态
  console.log('📊 检查Git状态...');
  const status = runCommand('git status --porcelain');
  
  if (!status.trim()) {
    console.log('没有检测到更改，无需部署');
    process.exit(0);
  }
  
  // 2. 询问提交信息
  const commitMessage = await new Promise((resolve) => {
    rl.question('请输入提交信息 (默认: "更新应用程序"): ', (answer) => {
      resolve(answer || '更新应用程序');
    });
  });
  
  // 3. 添加所有文件到git
  console.log('📁 添加文件到Git...');
  runCommand('git add .');
  
  // 4. 提交更改
  console.log('💾 提交更改...');
  runCommand(`git commit -m "${commitMessage}"`);
  
  // 5. 推送到远程仓库
  console.log('☁️ 推送到远程仓库...');
  runCommand('git push origin main');
  
  // 6. 使用Vercel CLI部署
  console.log('🌐 部署到Vercel...');
  runCommand('npx vercel --prod');
  
  console.log('✅ 部署完成！');
  rl.close();
}

// 执行部署流程
deploy().catch(err => {
  console.error('部署过程中发生错误:', err);
  process.exit(1);
}); 