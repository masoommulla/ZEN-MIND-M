import { motion } from 'motion/react';
import { ReactNode, useState } from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: '3d' | 'glow' | 'gradient' | 'float';
  className?: string;
}

export function AnimatedButton({ 
  children, 
  onClick, 
  variant = '3d',
  className = '' 
}: AnimatedButtonProps) {
  
  if (variant === '3d') {
    return (
      <motion.button
        onClick={onClick}
        className={`relative px-8 py-4 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl shadow-2xl overflow-hidden ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
        whileHover={{ 
          scale: 1.05,
          rotateX: 10,
          rotateY: 5,
          boxShadow: '0 25px 50px rgba(168, 85, 247, 0.5)'
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* 3D depth layers */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
          style={{ transform: 'translateZ(10px)' }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20 rounded-2xl"
          style={{ transform: 'translateZ(-5px)' }}
        />
        
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Border highlight */}
        <div 
          className="absolute inset-0 rounded-2xl border-2 border-white/30"
          style={{ transform: 'translateZ(12px)' }}
        />
      </motion.button>
    );
  }
  
  if (variant === 'glow') {
    return (
      <motion.button
        onClick={onClick}
        className={`relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full overflow-hidden ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Pulsing glow */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Rotating gradient overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.button>
    );
  }
  
  if (variant === 'gradient') {
    return (
      <motion.button
        onClick={onClick}
        className={`relative px-8 py-4 text-white rounded-full overflow-hidden ${className}`}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          backgroundSize: '200% 200%'
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear'
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors"
        />
      </motion.button>
    );
  }
  
  // Float variant
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-full shadow-2xl ${className}`}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: '0 30px 60px rgba(168, 85, 247, 0.4)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            bottom: '100%',
          }}
          animate={{
            y: [-20, -60],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </motion.button>
  );
}

// Magnetic Button - follows mouse
export function MagneticButton({ 
  children, 
  onClick,
  className = '' 
}: AnimatedButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setPosition({ 
      x: x * 0.3, 
      y: y * 0.3 
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={position}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={`relative px-8 py-4 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white rounded-2xl shadow-2xl ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 blur-xl opacity-0"
        whileHover={{ opacity: 0.6 }}
      />
    </motion.button>
  );
}
