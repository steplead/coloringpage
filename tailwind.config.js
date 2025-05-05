/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 吉卜力主色调 - 优化为更和谐的色系
        'ghibli-primary': {
          light: '#62a7e4',  // 亮天空蓝
          DEFAULT: '#4a8fdd', // 天空蓝
          dark: '#3a7bc9',   // 深天空蓝
        },
        'ghibli-secondary': {
          light: '#9fd95e',  // 亮绿色
          DEFAULT: '#8cc152', // 托托罗绿
          dark: '#79ad41',   // 深绿色
        },
        'ghibli-accent': {
          light: '#ffd761',  // 亮黄色
          DEFAULT: '#fcbb42', // 魔女黄
          dark: '#e9a930',   // 深黄色
        },
        
        // 中性色 - 增强温暖感
        'ghibli-warm-white': {
          lighter: '#fffbef', // 更亮的温暖白
          DEFAULT: '#f8f4e3', // 温暖白
          darker: '#eee9d5',  // 较深的温暖白
        },
        'ghibli-pale-blue': {
          lighter: '#f0f7ff', // 更亮的淡蓝
          DEFAULT: '#e4eefb', // 淡蓝
          darker: '#d0e3f7',  // 较深的淡蓝
        },
        'ghibli-light-brown': {
          lighter: '#e0c9a7', // 更亮的浅棕
          DEFAULT: '#d2b48c', // 浅棕
          darker: '#c4a675',  // 较深的浅棕
        },
        'ghibli-dark-brown': {
          lighter: '#86644a', // 较亮的深棕
          DEFAULT: '#73553a', // 深棕
          darker: '#5f4530',  // 更深的深棕
        },
        
        // 强调色 - 微调色彩以增强视觉吸引力
        'ghibli-red': {
          light: '#f26977',   // 亮红色
          DEFAULT: '#ed5565', // 红色点缀
          dark: '#d94452',    // 深红色
        },
        'ghibli-orange': {
          light: '#fd8266',   // 亮橙色
          DEFAULT: '#fc6e51', // 橙色
          dark: '#ea5b3d',    // 深橙色
        },
        'ghibli-purple': {
          light: '#a78be4',   // 亮紫色
          DEFAULT: '#967adc', // 紫色
          dark: '#8269c2',    // 深紫色
        },
        
        // 状态颜色 - 用于反馈系统
        'ghibli-success': {
          light: '#9fd95e',
          DEFAULT: '#8cc152',
          dark: '#79ad41',
        },
        'ghibli-warning': {
          light: '#ffd761',
          DEFAULT: '#fcbb42',
          dark: '#e9a930',
        },
        'ghibli-error': {
          light: '#f26977',
          DEFAULT: '#ed5565',
          dark: '#d94452',
        },
        'ghibli-info': {
          light: '#62a7e4',
          DEFAULT: '#4a8fdd',
          dark: '#3a7bc9',
        },
      },
      backgroundImage: {
        // 增强渐变系统
        'ghibli-sky-gradient': 'linear-gradient(to bottom, #7bb2e3 0%, #d9ecff 100%)',
        'ghibli-sky-soft': 'linear-gradient(to bottom, rgba(123, 178, 227, 0.8) 0%, rgba(217, 236, 255, 0.8) 100%)',
        'ghibli-meadow-gradient': 'linear-gradient(to bottom, #8cc152 0%, #a0d468 100%)',
        'ghibli-meadow-soft': 'linear-gradient(to bottom, rgba(140, 193, 82, 0.8) 0%, rgba(160, 212, 104, 0.8) 100%)',
        'ghibli-sunset-gradient': 'linear-gradient(to bottom, #ffce54 0%, #fcbb42 60%, #fc6e51 100%)',
        'ghibli-sunset-soft': 'linear-gradient(to bottom, rgba(255, 206, 84, 0.8) 0%, rgba(252, 187, 66, 0.8) 60%, rgba(252, 110, 81, 0.8) 100%)',
        'ghibli-dream-gradient': 'linear-gradient(to bottom right, #e4eefb 0%, #967adc 100%)',
        'ghibli-warm-gradient': 'linear-gradient(to bottom, #f8f4e3 0%, #d2b48c 100%)',
        'ghibli-card-gradient': 'linear-gradient(120deg, rgba(255,255,255,0.9) 0%, rgba(248, 244, 227, 0.8) 100%)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'ghibli-sm': '0 1px 3px rgba(115, 85, 58, 0.1), 0 1px 2px rgba(115, 85, 58, 0.06)',
        'ghibli-md': '0 4px 6px rgba(115, 85, 58, 0.1), 0 2px 4px rgba(115, 85, 58, 0.06)',
        'ghibli-lg': '0 10px 15px rgba(115, 85, 58, 0.1), 0 4px 6px rgba(115, 85, 58, 0.05)',
        'ghibli-xl': '0 15px 25px rgba(115, 85, 58, 0.08), 0 5px 10px rgba(115, 85, 58, 0.04)',
        'ghibli-inner': 'inset 0 2px 4px rgba(115, 85, 58, 0.06)',
        'ghibli-button': '0 4px 6px rgba(74, 143, 221, 0.25)',
      },
      fontFamily: {
        'ghibli': ['Gaegu', 'Comic Neue', 'cursive'],
        'body': ['Nunito', 'sans-serif'],
      },
      opacity: {
        '85': '0.85',
        '95': '0.95',
      },
      transitionProperty: {
        'filter': 'filter',
        'backdrop': 'backdrop-filter',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  // 添加可能动态生成的类名
  safelist: [
    // 宽度类
    'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-7', 'w-8',
    // 高度类
    'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-7', 'h-8',
    // 位置类
    'top-1/3', 'top-1/4', 'top-1/5', 'top-2/5',
    'left-1/3', 'left-1/4', 'left-1/5', 'left-2/5',
    'right-1/3', 'right-1/4',
    // 背景渐变
    'bg-ghibli-sky-gradient', 'bg-ghibli-sky-soft',
    'bg-ghibli-meadow-gradient', 'bg-ghibli-meadow-soft',
    'bg-ghibli-sunset-gradient', 'bg-ghibli-sunset-soft',
    'bg-ghibli-dream-gradient', 'bg-ghibli-warm-gradient',
    // 状态颜色
    'text-ghibli-success', 'text-ghibli-warning', 'text-ghibli-error', 'text-ghibli-info',
    'bg-ghibli-success', 'bg-ghibli-warning', 'bg-ghibli-error', 'bg-ghibli-info',
    'border-ghibli-success', 'border-ghibli-warning', 'border-ghibli-error', 'border-ghibli-info',
  ],
  plugins: [require("tailwindcss-animate")],
}
