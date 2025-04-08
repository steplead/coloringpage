#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk') || { green: (t) => t, red: (t) => t, yellow: (t) => t, blue: (t) => t };

/**
 * 执行命令行命令并打印输出
 * @param {string} command 要执行的命令
 * @param {boolean} silent 是否静默执行（不打印输出）
 */
function runCommand(command, silent = false) {
  if (!silent) console.log(chalk.blue(`执行: ${command}`));
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (!silent) console.log(output);
    return output;
  } catch (error) {
    console.error(chalk.red(`命令执行错误: ${error.message}`));
    if (error.stdout) console.error(chalk.yellow(error.stdout));
    if (error.stderr) console.error(chalk.red(error.stderr));
    throw error; // 重新抛出错误以供上层处理
  }
}

/**
 * 检查是否有GitHub Actions可用
 */
function hasGitHubActions() {
  try {
    const result = runCommand('ls -la .github/workflows/deploy.yml', true);
    return result.includes('deploy.yml');
  } catch (error) {
    return false;
  }
}

/**
 * 检查.vercel文件夹是否存在
 */
function hasVercelConfig() {
  try {
    const result = runCommand('ls -la .vercel/project.json', true);
    return result.includes('project.json');
  } catch (error) {
    return false;
  }
}

/**
 * 主函数 - 自动执行部署流程
 */
async function autoDeploy() {
  console.log(chalk.green('🚀 开始自动部署流程...'));
  
  try {
    // 1. 检查git状态
    console.log(chalk.blue('📊 检查Git状态...'));
    const status = runCommand('git status --porcelain');
    
    if (!status.trim()) {
      console.log(chalk.yellow('没有检测到更改，无需部署'));
      process.exit(0);
    }
    
    // 获取当前日期和时间作为提交信息的一部分
    const now = new Date();
    const commitMessage = `自动更新应用程序 - ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    
    // 2. 添加所有文件到git
    console.log(chalk.blue('📁 添加文件到Git...'));
    runCommand('git add .');
    
    // 3. 提交更改
    console.log(chalk.blue('💾 提交更改...'));
    runCommand(`git commit -m "${commitMessage}"`);
    
    // 4. 推送到远程仓库
    console.log(chalk.blue('☁️ 推送到远程仓库...'));
    runCommand('git push origin main');
    
    // 检查是否有GitHub Actions配置
    if (hasGitHubActions()) {
      console.log(chalk.green('✅ 已检测到GitHub Actions配置，部署将自动进行!'));
      console.log(chalk.yellow('请在GitHub Actions页面查看部署状态。'));
      return;
    }
    
    // 检查是否有Vercel配置
    if (!hasVercelConfig()) {
      console.log(chalk.yellow('⚠️ 没有找到Vercel配置，请先运行 `vercel link` 关联项目。'));
      console.log(chalk.yellow('如需完整自动部署功能，请设置GitHub Actions，具体步骤见 README.md.vercel-deployment。'));
      return;
    }
    
    // 5. 使用Vercel CLI部署
    console.log(chalk.blue('🌐 部署到Vercel...'));
    const deployOutput = runCommand('npx vercel --prod --yes'); // 加上--yes参数以自动确认所有提示
    
    console.log(chalk.green('✅ 部署完成！'));
    
    // 解析部署URL
    const deployUrl = deployOutput.match(/https:\/\/[a-z0-9-]+\.vercel\.app/);
    if (deployUrl) {
      console.log(chalk.green(`🔗 部署URL: ${deployUrl[0]}`));
    }
  } catch (error) {
    console.error(chalk.red('❌ 部署过程中发生错误!'));
    process.exit(1);
  }
}

// 执行部署流程
autoDeploy().catch(err => {
  console.error(chalk.red('部署过程中发生错误:'), err);
  process.exit(1);
}); 