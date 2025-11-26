import { motion } from 'motion/react';

export function FloatingSticker({ emoji, delay = 0, className = '' }: { emoji: string; delay?: number; className?: string }) {
  return (
    <motion.div
      className={`text-6xl ${className}`}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      {emoji}
    </motion.div>
  );
}

export function StarBurst({ color = '#FFD700', className = '' }: { color?: string; className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      <motion.path
        d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z"
        fill={color}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function CloudShape({ className = '', color = '#E0E7FF' }: { className?: string; color?: string }) {
  return (
    <motion.svg
      viewBox="0 0 200 100"
      className={className}
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path
        d="M 30 60 Q 20 40 40 35 Q 45 20 65 25 Q 80 15 95 25 Q 115 20 125 35 Q 145 30 155 45 Q 175 50 165 65 Q 170 80 150 80 L 50 80 Q 25 80 30 60 Z"
        fill={color}
        opacity="0.6"
      />
    </motion.svg>
  );
}

export function HeartPulse({ className = '' }: { className?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={className}
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="100%" stopColor="#FFC0CB" />
        </linearGradient>
      </defs>
      <path
        d="M50 80 L20 50 Q 10 40 10 30 Q 10 15 25 15 Q 35 15 50 30 Q 65 15 75 15 Q 90 15 90 30 Q 90 40 80 50 Z"
        fill="url(#heartGradient)"
      />
    </motion.svg>
  );
}

export function RainbowArc({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className}>
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B9D" />
          <stop offset="25%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#60A5FA" />
          <stop offset="75%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <motion.path
        d="M 10 90 Q 100 10 190 90"
        stroke="url(#rainbow)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
    </svg>
  );
}

export function SparkleEffect({ className = '' }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 100 100" className={className}>
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <motion.path
          d="M50 10 L52 48 L90 50 L52 52 L50 90 L48 52 L10 50 L48 48 Z"
          fill="#FFD700"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.g>
      <motion.circle
        cx="50"
        cy="50"
        r="35"
        fill="none"
        stroke="#FFD700"
        strokeWidth="2"
        opacity="0.3"
        animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function BubbleChat({ message, className = '' }: { message: string; className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', damping: 10 }}
      className={`relative bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl px-6 py-4 text-white shadow-xl ${className}`}
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl"
        >
          💬
        </motion.div>
        <span>{message}</span>
      </div>
      {/* Bubble tail */}
      <div className="absolute -bottom-3 left-8 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 transform rotate-45" />
    </motion.div>
  );
}

export function CuteSticker({ 
  type = 'star',
  className = '' 
}: { 
  type?: 'star' | 'heart' | 'flower' | 'sun' | 'moon';
  className?: string;
}) {
  const stickers = {
    star: (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
        <motion.path
          d="M50 15 L58 40 L85 45 L65 62 L70 90 L50 75 L30 90 L35 62 L15 45 L42 40 Z"
          fill="url(#starGrad)"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: '50% 50%' }}
        />
        <circle cx="50" cy="50" r="3" fill="white" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 100 100" className={className}>
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="100%" stopColor="#C026D3" />
          </linearGradient>
        </defs>
        <motion.path
          d="M50 85 L15 50 Q 5 40 5 28 Q 5 10 22 10 Q 35 10 50 25 Q 65 10 78 10 Q 95 10 95 28 Q 95 40 85 50 Z"
          fill="url(#heartGrad)"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ transformOrigin: '50% 50%' }}
        />
      </svg>
    ),
    flower: (
      <svg viewBox="0 0 100 100" className={className}>
        <motion.g
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {/* Petals */}
          <circle cx="50" cy="25" r="15" fill="#FFB3E6" />
          <circle cx="75" cy="50" r="15" fill="#FFB3E6" />
          <circle cx="50" cy="75" r="15" fill="#FFB3E6" />
          <circle cx="25" cy="50" r="15" fill="#FFB3E6" />
          <circle cx="65" cy="35" r="15" fill="#FFB3E6" />
          <circle cx="65" cy="65" r="15" fill="#FFB3E6" />
          <circle cx="35" cy="65" r="15" fill="#FFB3E6" />
          <circle cx="35" cy="35" r="15" fill="#FFB3E6" />
          {/* Center */}
          <circle cx="50" cy="50" r="18" fill="#FBBF24" />
        </motion.g>
      </svg>
    ),
    sun: (
      <svg viewBox="0 0 100 100" className={className}>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 50%' }}
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="15"
              x2="50"
              y2="5"
              stroke="#FBBF24"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${i * 45} 50 50)`}
            />
          ))}
        </motion.g>
        <circle cx="50" cy="50" r="20" fill="#FBBF24" />
        <circle cx="45" cy="45" r="3" fill="white" opacity="0.8" />
      </svg>
    ),
    moon: (
      <svg viewBox="0 0 100 100" className={className}>
        <motion.g
          animate={{ rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{ transformOrigin: '50% 50%' }}
        >
          <path
            d="M 40 20 Q 30 50 40 80 Q 60 70 70 50 Q 60 30 40 20 Z"
            fill="#E0E7FF"
          />
          <circle cx="45" cy="40" r="4" fill="#A5B4FC" />
          <circle cx="50" cy="55" r="6" fill="#A5B4FC" />
          <circle cx="45" cy="70" r="3" fill="#A5B4FC" />
        </motion.g>
      </svg>
    ),
  };

  return stickers[type];
}
