import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// 3D Floating Cube
export function FloatingCube({ className = '', color = 'purple' }: { className?: string; color?: string }) {
  const colorMap = {
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    yellow: 'from-yellow-400 to-yellow-600'
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      animate={{
        rotateX: [0, 360],
        rotateY: [0, 360],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* Front face */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} opacity-80 rounded-lg border-2 border-white/30`}
          style={{ transform: 'translateZ(40px)' }}
        />
        {/* Back face */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} opacity-60 rounded-lg border-2 border-white/20`}
          style={{ transform: 'translateZ(-40px) rotateY(180deg)' }}
        />
        {/* Right face */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} opacity-70 rounded-lg border-2 border-white/25`}
          style={{ transform: 'rotateY(90deg) translateZ(40px)' }}
        />
        {/* Left face */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} opacity-70 rounded-lg border-2 border-white/25`}
          style={{ transform: 'rotateY(-90deg) translateZ(40px)' }}
        />
        {/* Top face */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} opacity-90 rounded-lg border-2 border-white/35`}
          style={{ transform: 'rotateX(90deg) translateZ(40px)' }}
        />
        {/* Bottom face */}
        <div 
          className={`absolute inset-0 bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} opacity-50 rounded-lg border-2 border-white/15`}
          style={{ transform: 'rotateX(-90deg) translateZ(40px)' }}
        />
      </div>
    </motion.div>
  );
}

// 3D Floating Sphere
export function FloatingSphere({ className = '', color = 'pink' }: { className?: string; color?: string }) {
  const colorMap = {
    purple: 'from-purple-400 via-purple-500 to-purple-600',
    pink: 'from-pink-400 via-pink-500 to-pink-600',
    blue: 'from-blue-400 via-blue-500 to-blue-600',
    green: 'from-green-400 via-green-500 to-green-600',
    orange: 'from-orange-400 via-orange-500 to-orange-600'
  };

  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        y: [0, -30, 0],
        rotateZ: [0, 360],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <div 
        className={`w-full h-full rounded-full bg-gradient-to-br ${colorMap[color as keyof typeof colorMap]} shadow-2xl`}
        style={{
          boxShadow: `0 20px 60px rgba(168, 85, 247, 0.4), 
                      inset 0 -20px 40px rgba(0, 0, 0, 0.2),
                      inset 0 20px 40px rgba(255, 255, 255, 0.3)`
        }}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-white/40 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 3,
            repeat: Infinity
          }}
        />
      </div>
    </motion.div>
  );
}

// 3D Pyramid
export function FloatingPyramid({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      animate={{
        rotateY: [0, 360],
        y: [0, -15, 0],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* Base */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 opacity-70"
          style={{ 
            transform: 'rotateX(90deg) translateZ(-40px)',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}
        />
        {/* Front face */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-80"
          style={{ 
            transform: 'translateZ(20px)',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}
        />
        {/* Right face */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-75"
          style={{ 
            transform: 'rotateY(90deg) translateZ(20px)',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}
        />
        {/* Left face */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-700 opacity-75"
          style={{ 
            transform: 'rotateY(-90deg) translateZ(20px)',
            clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
          }}
        />
      </div>
    </motion.div>
  );
}

// 3D Ring/Torus
export function FloatingRing({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      animate={{
        rotateX: [0, 360],
        rotateZ: [0, 360],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <div 
        className="w-full h-full rounded-full border-[20px] border-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
        style={{
          borderImage: 'linear-gradient(135deg, #a855f7, #ec4899, #3b82f6) 1',
          boxShadow: `0 0 30px rgba(168, 85, 247, 0.5),
                      inset 0 0 30px rgba(168, 85, 247, 0.3)`
        }}
      />
    </motion.div>
  );
}

// 3D Star
export function FloatingStar({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{
        rotate: [0, 360],
        scale: [1, 1.2, 1],
        y: [0, -20, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      style={{ 
        filter: 'drop-shadow(0 0 20px rgba(250, 204, 21, 0.6))'
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <motion.path
          d="M50 10 L61 38 L90 38 L67 55 L78 83 L50 66 L22 83 L33 55 L10 38 L39 38 Z"
          fill="url(#starGradient)"
          stroke="white"
          strokeWidth="2"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        {/* Inner shine */}
        <motion.circle
          cx="50"
          cy="40"
          r="15"
          fill="white"
          opacity="0.3"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </svg>
    </motion.div>
  );
}

// 3D Hexagon
export function FloatingHexagon({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
      animate={{
        rotateY: [0, 360],
        rotateX: [0, 20, 0],
        y: [0, -25, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="hexShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="5" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <motion.path
          d="M 50 5 L 90 27.5 L 90 72.5 L 50 95 L 10 72.5 L 10 27.5 Z"
          fill="url(#hexGradient)"
          stroke="white"
          strokeWidth="2"
          filter="url(#hexShadow)"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        {/* Inner hexagon for depth */}
        <path
          d="M 50 20 L 75 32.5 L 75 67.5 L 50 80 L 25 67.5 L 25 32.5 Z"
          fill="rgba(255, 255, 255, 0.2)"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
}

// Animated Background with 3D shapes
export function Animated3DBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
      <FloatingCube className="absolute top-[10%] left-[10%] w-20 h-20" color="purple" />
      <FloatingSphere className="absolute top-[15%] right-[15%] w-24 h-24" color="pink" />
      <FloatingPyramid className="absolute bottom-[20%] left-[15%] w-16 h-16" />
      <FloatingRing className="absolute top-[50%] right-[10%] w-28 h-28" />
      <FloatingStar className="absolute bottom-[15%] right-[20%] w-20 h-20" />
      <FloatingHexagon className="absolute top-[70%] left-[20%] w-24 h-24" />
      
      {/* More scattered shapes */}
      <FloatingCube className="absolute top-[40%] left-[70%] w-16 h-16" color="blue" />
      <FloatingSphere className="absolute bottom-[40%] right-[60%] w-20 h-20" color="green" />
      <FloatingHexagon className="absolute top-[25%] left-[50%] w-16 h-16" />
      <FloatingStar className="absolute bottom-[50%] left-[40%] w-16 h-16" />
    </div>
  );
}

// Page transition wrapper with 3D effect
export function PageTransition3D({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.8, 
        rotateY: -90,
        z: -100
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        z: 0
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.8, 
        rotateY: 90,
        z: -100
      }}
      transition={{ 
        duration: 0.6,
        type: 'spring',
        damping: 20
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px'
      }}
    >
      {children}
    </motion.div>
  );
}

// 3D Card Hover Effect
export function Card3D({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateXValue = (y - centerY) / 10;
    const rotateYValue = (centerX - x) / 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {children}
    </motion.div>
  );
}
