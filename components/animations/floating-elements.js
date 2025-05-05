import { motion } from 'framer-motion';

export default function FloatingElements({ count = 5, type = 'default' }) {
  // 不同类型的元素配置
  const elementTypes = {
    default: {
      className: "rounded-full bg-white/60 blur-sm",
      sizes: [8, 10, 12, 16], // 像素大小
    },
    leaf: {
      className: "bg-ghibli-secondary/60 rotate-45",
      sizes: [10, 14, 18, 20],
    },
    dust: {
      className: "rounded-full bg-ghibli-accent/40 blur-md",
      sizes: [6, 8, 10],
    }
  };
  
  const config = elementTypes[type] || elementTypes.default;
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => {
        const size = config.sizes[i % config.sizes.length];
        return (
          <motion.div
            key={i}
            className={config.className}
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 30 - 15, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, Math.random() * 180, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
} 