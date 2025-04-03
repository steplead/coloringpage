# 自动部署工具使用说明

本项目提供了多种自动部署到Vercel的方法，方便开发者快速将本地代码更新到生产环境。

## 部署方法

### 1. 交互式部署 (需要用户输入)

这种方式允许您手动输入Git提交信息：

```bash
npm run deploy
```

### 2. 全自动部署 (无需交互)

这种方式使用当前日期和时间作为提交信息，无需任何用户输入：

```bash
npm run deploy:auto
```

### 3. 快速部署命令

这是一个简便的命令，可以直接从项目根目录执行：

```bash
npm run quick-deploy
```

默认为全自动模式，如果需要交互式部署，可以添加参数：

```bash
npm run quick-deploy -- interactive
```

### 4. 通过Cursor命令执行

如果您已经将项目链接到全局npm，可以在任何目录下使用以下命令进行部署：

```bash
cursor-deploy            # 自动部署
cursor-deploy interactive # 交互式部署
```

## 安装为全局命令

如果您希望可以从任何位置调用部署命令，可以将本包安装到全局：

```bash
npm install -g .
```

安装后，您可以在任何地方使用`cursor-deploy`命令。

## 通过编辑器集成

您可以将`cursor-deploy`命令配置为编辑器中的自定义任务或快捷键，实现一键部署。

### 在VS Code中设置

1. 打开命令面板 (`Ctrl+Shift+P` 或 `Cmd+Shift+P`)
2. 输入 "Open Keyboard Shortcuts (JSON)"
3. 添加以下内容：

```json
[
  {
    "key": "ctrl+alt+d",  // 或您喜欢的快捷键
    "command": "workbench.action.terminal.sendSequence",
    "args": { "text": "npm run quick-deploy\n" }
  }
]
```

## 部署过程中的问题排查

如果部署过程中遇到问题：

1. 确保您已安装所有依赖 (`npm install`)
2. 确保您有推送到GitHub仓库的权限
3. 确保已经配置了Vercel CLI (`npm i -g vercel` 并运行 `vercel login`) 