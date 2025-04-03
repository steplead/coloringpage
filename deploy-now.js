#!/usr/bin/env node

/**
 * 快速部署脚本
 * 使用方法: node deploy-now.js
 */

console.log('🚀 开始快速部署到Vercel...');

// 导入部署模块
const deployModule = require('./src/lib/cursor-deploy');

// 执行自动部署
deployModule.autoDeploy(); 