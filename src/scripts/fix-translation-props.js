#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取所有包含path="的文件
const files = execSync('grep -r \'path="\' --include="*.tsx" src/app')
  .toString()
  .split('\n')
  .filter(line => line.trim().length > 0)
  .map(line => {
    const filePath = line.split(':')[0];
    return filePath;
  })
  .filter((v, i, a) => a.indexOf(v) === i); // 去重

console.log(`找到 ${files.length} 个文件需要修复`);

let totalChanges = 0;

// 处理每个文件
files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const newContent = content.replace(/path="/g, 'translationKey="');
  
  if (content !== newContent) {
    const changes = (content.match(/path="/g) || []).length;
    totalChanges += changes;
    console.log(`修复 ${filePath} 中的 ${changes} 处引用`);
    fs.writeFileSync(filePath, newContent);
  }
});

console.log(`完成! 总共修复了 ${totalChanges} 处 'path' 属性为 'translationKey' 属性`); 