#!/usr/bin/env node

const { execSync } = require('child_process');

// Define a fallback chalk object for cases where dynamic import fails
const fallbackChalk = {
  green: (text) => text,
  red: (text) => text,
  yellow: (text) => text,
  blue: (text) => text,
};

/**
 * Execute command line commands and print output
 * Uses the globally available 'chalk' variable after dynamic import
 * @param {string} command The command to execute
 * @param {object} chalkInstance The chalk instance (passed after dynamic import)
 * @param {boolean} silent Whether to suppress output
 */
function runCommand(command, chalkInstance, silent = false) {
  if (!silent) console.log(chalkInstance.blue(`执行: ${command}`));
  try {
    const output = execSync(command, { encoding: 'utf8' });
    if (!silent) console.log(output);
    return output;
  } catch (error) {
    console.error(chalkInstance.red(`命令执行错误: ${error.message}`));
    if (error.stdout) console.error(chalkInstance.yellow(error.stdout));
    if (error.stderr) console.error(chalkInstance.red(error.stderr));
    throw error; // Re-throw the error for higher-level handling
  }
}

/**
 * Check if GitHub Actions are available
 * @param {object} chalkInstance The chalk instance
 */
function hasGitHubActions(chalkInstance) {
  try {
    const result = runCommand('ls -la .github/workflows/deploy.yml', chalkInstance, true);
    return result.includes('deploy.yml');
  } catch (error) {
    return false;
  }
}

/**
 * Check if .vercel folder exists
 * @param {object} chalkInstance The chalk instance
 */
function hasVercelConfig(chalkInstance) {
  try {
    const result = runCommand('ls -la .vercel/project.json', chalkInstance, true);
    return result.includes('project.json');
  } catch (error) {
    return false;
  }
}

/**
 * Main function - automatically execute the deployment process
 */
async function autoDeploy() {
  let chalk = fallbackChalk; // Start with fallback
  try {
    // Dynamically import chalk
    const chalkModule = await import('chalk');
    chalk = chalkModule.default; // Use the default export
    console.log(chalk.green('Chalk loaded successfully.'));
  } catch (e) {
    console.warn('Failed to dynamically import chalk, using fallback.');
  }

  console.log(chalk.green('🚀 开始自动部署流程...'));
  
  try {
    // 1. Check git status
    console.log(chalk.blue('📊 检查Git状态...'));
    const status = runCommand('git status --porcelain', chalk);
    
    if (!status.trim()) {
      console.log(chalk.yellow('没有检测到更改，无需部署'));
      process.exit(0);
    }
    
    // Get current date and time for commit message
    const now = new Date();
    const commitMessage = `自动更新应用程序 - ${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
    
    // 2. Add all files to git
    console.log(chalk.blue('📁 添加文件到Git...'));
    runCommand('git add .', chalk);
    
    // 3. Commit changes
    console.log(chalk.blue('💾 提交更改...'));
    runCommand(`git commit -m "${commitMessage}"`, chalk);
    
    // 4. Push to remote repository
    console.log(chalk.blue('☁️ 推送到远程仓库...'));
    runCommand('git push origin main', chalk);
    
    // Check for GitHub Actions configuration
    if (hasGitHubActions(chalk)) {
      console.log(chalk.green('✅ 已检测到GitHub Actions配置，部署将自动进行!'));
      console.log(chalk.yellow('请在GitHub Actions页面查看部署状态。'));
      return;
    }
    
    // Check for Vercel configuration
    if (!hasVercelConfig(chalk)) {
      console.log(chalk.yellow('⚠️ 没有找到Vercel配置，请先运行 `vercel link` 关联项目。'));
      console.log(chalk.yellow('如需完整自动部署功能，请设置GitHub Actions，具体步骤见 README.md.vercel-deployment。'));
      return;
    }
    
    // 5. Deploy using Vercel CLI
    console.log(chalk.blue('🌐 部署到Vercel...'));
    const deployOutput = runCommand('npx vercel --prod --yes', chalk); // Add --yes to auto-confirm prompts
    
    console.log(chalk.green('✅ 部署完成！'));
    
    // Parse deployment URL
    const deployUrlMatch = deployOutput.match(/https:\/\/[a-z0-9-]+\.vercel\.app/);
    if (deployUrlMatch) {
      console.log(chalk.green(`🔗 部署URL: ${deployUrlMatch[0]}`));
    }
  } catch (error) {
    console.error(chalk.red('❌ 部署过程中发生错误!'));
    process.exit(1);
  }
}

// Execute the deployment process
autoDeploy().catch(err => {
  // Use fallback chalk for the final error message just in case
  console.error(fallbackChalk.red('部署过程中发生严重错误:'), err);
  process.exit(1);
}); 