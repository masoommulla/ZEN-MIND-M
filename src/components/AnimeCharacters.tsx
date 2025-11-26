import { motion } from 'motion/react';

export function HappyCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#FFE5E5" />
      
      {/* Hair */}
      <path
        d="M 40 80 Q 30 40 60 30 Q 80 20 100 25 Q 120 20 140 30 Q 170 40 160 80"
        fill="#9D7AFF"
      />
      
      {/* Eyes */}
      <motion.g
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
      >
        <ellipse cx="75" cy="95" rx="8" ry="12" fill="#2D2D2D" />
        <ellipse cx="125" cy="95" rx="8" ry="12" fill="#2D2D2D" />
        <circle cx="77" cy="92" r="3" fill="white" />
        <circle cx="127" cy="92" r="3" fill="white" />
      </motion.g>
      
      {/* Blush */}
      <ellipse cx="60" cy="110" rx="12" ry="8" fill="#FFB3BA" opacity="0.5" />
      <ellipse cx="140" cy="110" rx="12" ry="8" fill="#FFB3BA" opacity="0.5" />
      
      {/* Smile */}
      <path
        d="M 70 115 Q 100 130 130 115"
        stroke="#2D2D2D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Sparkles */}
      <motion.g
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <circle cx="40" cy="60" r="3" fill="#FFD700" />
        <circle cx="45" cy="65" r="2" fill="#FFD700" />
        <circle cx="160" cy="60" r="3" fill="#FFD700" />
        <circle cx="155" cy="55" r="2" fill="#FFD700" />
      </motion.g>
    </motion.svg>
  );
}

export function CalmCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#E5F4FF" />
      
      {/* Hair */}
      <path
        d="M 35 85 Q 25 45 55 35 Q 75 25 100 30 Q 125 25 145 35 Q 175 45 165 85"
        fill="#7EC8E3"
      />
      
      {/* Closed eyes (peaceful) */}
      <motion.g
        animate={{ scaleY: [1, 1.1, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <path d="M 65 95 Q 75 90 85 95" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 115 95 Q 125 90 135 95" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
      
      {/* Gentle smile */}
      <path
        d="M 80 120 Q 100 125 120 120"
        stroke="#2D2D2D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Meditation aura */}
      <motion.circle
        cx="100"
        cy="100"
        r="85"
        fill="none"
        stroke="#7EC8E3"
        strokeWidth="2"
        opacity="0.3"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function ChatbotMascot() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, -12, 0], rotate: [0, 5, 0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Robot body */}
      <rect x="50" y="80" width="100" height="90" rx="20" fill="url(#gradientBot)" />
      
      <defs>
        <linearGradient id="gradientBot" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B794F6" />
          <stop offset="100%" stopColor="#F687B3" />
        </linearGradient>
      </defs>
      
      {/* Head */}
      <circle cx="100" cy="60" r="35" fill="url(#gradientBot)" />
      
      {/* Antenna */}
      <line x1="100" y1="25" x2="100" y2="35" stroke="#B794F6" strokeWidth="3" strokeLinecap="round" />
      <motion.circle
        cx="100"
        cy="20"
        r="5"
        fill="#FFD700"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Eyes */}
      <motion.g
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <circle cx="85" cy="60" r="8" fill="white" />
        <circle cx="115" cy="60" r="8" fill="white" />
        <circle cx="87" cy="62" r="4" fill="#2D2D2D" />
        <circle cx="117" cy="62" r="4" fill="#2D2D2D" />
      </motion.g>
      
      {/* Happy mouth */}
      <path
        d="M 80 70 Q 100 78 120 70"
        stroke="white"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Heart on chest */}
      <motion.path
        d="M 100 110 L 95 105 Q 90 100 90 95 Q 90 90 95 90 Q 100 90 100 95 Q 100 90 105 90 Q 110 90 110 95 Q 110 100 105 105 Z"
        fill="#FF6B9D"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Arms */}
      <motion.rect
        x="30"
        y="100"
        width="15"
        height="40"
        rx="8"
        fill="#B794F6"
        animate={{ rotate: [0, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '37px 100px' }}
      />
      <motion.rect
        x="155"
        y="100"
        width="15"
        height="40"
        rx="8"
        fill="#B794F6"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '162px 100px' }}
      />
    </motion.svg>
  );
}

export function ThinkingCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="110" r="65" fill="#FFF5E5" />
      
      {/* Hair */}
      <ellipse cx="100" cy="70" rx="70" ry="45" fill="#FF9E80" />
      
      {/* Eyes looking up */}
      <circle cx="80" cy="105" r="10" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <circle cx="120" cy="105" r="10" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <circle cx="78" cy="100" r="5" fill="#2D2D2D" />
      <circle cx="118" cy="100" r="5" fill="#2D2D2D" />
      
      {/* Thinking expression */}
      <path
        d="M 85 125 Q 100 128 115 125"
        stroke="#2D2D2D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Thought bubbles */}
      <motion.g
        animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <circle cx="150" cy="50" r="8" fill="white" stroke="#B794F6" strokeWidth="2" />
        <circle cx="165" cy="35" r="12" fill="white" stroke="#B794F6" strokeWidth="2" />
        <circle cx="175" cy="20" r="18" fill="white" stroke="#B794F6" strokeWidth="2" />
        <text x="165" y="26" fontSize="16" fill="#B794F6">?</text>
      </motion.g>
    </motion.svg>
  );
}

export function SupportiveCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#E8F5E9" />
      
      {/* Hair */}
      <path
        d="M 30 90 Q 20 50 50 40 Q 70 30 100 35 Q 130 30 150 40 Q 180 50 170 90"
        fill="#81C784"
      />
      <circle cx="50" cy="75" r="15" fill="#81C784" />
      <circle cx="150" cy="75" r="15" fill="#81C784" />
      
      {/* Caring eyes */}
      <ellipse cx="75" cy="95" rx="10" ry="13" fill="#2D2D2D" />
      <ellipse cx="125" cy="95" rx="10" ry="13" fill="#2D2D2D" />
      <circle cx="77" cy="92" r="4" fill="white" />
      <circle cx="127" cy="92" r="4" fill="white" />
      
      {/* Warm smile */}
      <path
        d="M 65 115 Q 100 135 135 115"
        stroke="#2D2D2D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Hearts floating */}
      <motion.g
        animate={{ y: [0, -20, -40], opacity: [1, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <path d="M 45 120 L 40 115 Q 35 110 35 105 Q 35 100 40 100 Q 45 100 45 105 Q 45 100 50 100 Q 55 100 55 105 Q 55 110 50 115 Z" fill="#FF6B9D" />
      </motion.g>
      <motion.g
        animate={{ y: [0, -20, -40], opacity: [1, 0.5, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <path d="M 160 130 L 155 125 Q 150 120 150 115 Q 150 110 155 110 Q 160 110 160 115 Q 160 110 165 110 Q 170 110 170 115 Q 170 120 165 125 Z" fill="#FF6B9D" />
      </motion.g>
    </motion.svg>
  );
}
