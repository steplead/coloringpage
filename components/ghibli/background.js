import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function GhibliBackground({ imagePath = '/ghibli-reference-bg.jpg' }) {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      {/* 主背景图片 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${imagePath})`,
          filter: 'brightness(0.9)',
        }}
      ></div>
      
      {/* 半透明叠加层,使内容更易于阅读 */}
      <div className="absolute inset-0 bg-ghibli-warm-white/10 backdrop-blur-[1px]"></div>
      
      {/* 远景云彩 - 视差效果 */}
      <motion.div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ y: scrollY * 0.1 }}
      >
        {/* 漂浮元素,增强吉卜力风格 */}
        <div className="absolute bg-white/40 rounded-full blur-md" style={{ width: '4rem', height: '2rem', left: '25%', top: '13%' }}></div>
        <div className="absolute bg-white/40 rounded-full blur-md" style={{ width: '6rem', height: '2.5rem', right: '23%', top: '15%' }}></div>
        <div className="absolute bg-white/40 rounded-full blur-md" style={{ width: '5rem', height: '2rem', left: '13%', top: '40%' }}></div>
      </motion.div>
      
      {/* 装饰元素 - 随机漂浮 */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => {
          const width = (i % 3 + 3) * 4; // 计算宽度（像素值）
          const height = (i % 3 + 3) * 4; // 计算高度（像素值）
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-ghibli-accent/20 blur-sm"
              style={{
                width: `${width}px`,
                height: `${height}px`,
                top: `${(i * 15) + 5}%`,
                left: `${(i * 13 + 10) % 80}%`,
              }}
              animate={{
                y: [0, Math.random() * 30 + 10, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          );
        })}
      </div>
    </div>
  );
} 