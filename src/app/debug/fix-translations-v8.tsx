'use client';

import { useEffect } from 'react';

// 翻译字典 - 直接替换页面上的文本内容
const translations: Record<string, string> = {
  // 导航栏
  'ColoBuddy': 'ColorBuddy绘彩伙伴',
  'Gallery': '图库',
  'Create': '创建',
  'Generate Image': '生成图像',
  'Search in gallery': '在图库中搜索',
  
  // 首页
  'Turn your pictures into coloring pages': '将您的图片转换为涂色页',
  'Fast and free coloring page generator.': '快速免费的涂色页生成器。',
  'Upload your photo': '上传您的照片',
  'Our Gallery': '我们的图库',
  'The best AI coloring pages generator online': '最佳在线AI涂色页生成器',
  
  // 特性部分
  'Print Ready': '打印就绪',
  'Perfect quality for printing at any size': '适合任何尺寸打印的完美质量',
  'Kid Friendly': '儿童友好',
  'Simple enough for kids to use on their own': '简单到孩子们可以自己使用',
  'Private & Secure': '安全私密',
  'No account needed, your creations belong to you': '无需账户，您的创作属于您',
  'Full Control': '完全控制',
  'Adjust every detail to your liking': '根据您的喜好调整每个细节',
  
  // 创建页面
  'Create your coloring page': '创建您的涂色页',
  'Upload a photo or choose one from our gallery': '上传照片或从我们的图库中选择',
  'Drop your image here, or click to select': '将图片拖放至此，或点击选择',
  'JPG, PNG or WEBP (max. 5MB)': 'JPG、PNG或WEBP格式（最大5MB）',
  'or choose from gallery': '或从图库中选择',
  
  // 生成页面
  'Creating your coloring page...': '正在创建您的涂色页...',
  'This will take a few seconds': '这将需要几秒钟时间',
  'Your coloring page is ready!': '您的涂色页已准备就绪！',
  'Download': '下载',
  'Share': '分享',
  'Detail level': '细节水平',
  'Line thickness': '线条粗细',
  'Smoothness': '平滑度',
  'Brightness': '亮度',
  'Invert colors': '反转颜色',
  'Reset': '重置',
  'Back to gallery': '返回图库',
  
  // 图库页面
  'Coloring Pages Gallery': '涂色页图库',
  'Browse and find the perfect coloring page': '浏览并找到完美的涂色页',
  'Most popular': '最受欢迎',
  'Animals': '动物',
  'Nature': '自然',
  'People': '人物',
  'Fantasy': '幻想',
  'Mandalas': '曼陀罗',
  'Buildings': '建筑',
  'Food': '食物',
  'Vehicles': '交通工具',
  'Use this image': '使用此图像',
  
  // 其他通用元素
  'Loading...': '加载中...',
  'Error': '错误',
  'Submit': '提交',
  'Cancel': '取消',
  'Next': '下一步',
  'Previous': '上一步',
  'Close': '关闭',
  'Open': '打开',
  'Save': '保存',
  'Delete': '删除',
  'Edit': '编辑',
  'View': '查看',
  
  // 占位符文本
  'title': '标题',
  'description': '描述',
  
  // 按钮文本
  'DOWNLOAD PNG': '下载PNG',
  'DOWNLOAD PDF': '下载PDF',
  'Try again': '重试',
  
  // 特殊处理的元素
  'Adjust settings': '调整设置'
}

// 错误翻译修复函数
export default function FixTranslationsV8() {
  useEffect(() => {
    const fixAllTexts = () => {
      console.log('[FixTranslationsV8] 开始修复翻译...')
      
      // 修复文本函数
      const fixText = (element: Element) => {
        if (!element.textContent) return
        
        const originalText = element.textContent.trim()
        const translation = translations[originalText]
        
        if (translation && element.textContent !== translation) {
          console.log(`[FixTranslationsV8] 替换文本: "${originalText}" => "${translation}"`)
          element.textContent = translation
        }
      }
      
      // 获取页面所有文本节点并修复
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, label, div')
      textElements.forEach(fixText)
      
      // 处理特定元素
      document.querySelectorAll('[placeholder]').forEach(el => {
        const input = el as HTMLInputElement
        const placeholder = input.getAttribute('placeholder')
        if (placeholder && translations[placeholder]) {
          input.setAttribute('placeholder', translations[placeholder])
        }
      })
    }
    
    // 立即执行一次
    fixAllTexts()
    
    // 创建一个MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
      let needsFix = false
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          needsFix = true
        }
      })
      
      if (needsFix) {
        fixAllTexts()
      }
    })
    
    // 开始观察整个文档
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    })
    
    // 每3秒强制检查一次，确保不会遗漏
    const interval = setInterval(fixAllTexts, 3000)
    
    // 清理函数
    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])
  
  return null
} 