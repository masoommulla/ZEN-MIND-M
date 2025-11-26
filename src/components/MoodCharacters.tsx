import { motion } from 'motion/react';

export function AnxiousCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#FFF0E5" />
      
      {/* Hair */}
      <path
        d="M 35 85 Q 25 50 55 40 Q 75 30 100 35 Q 125 30 145 40 Q 175 50 165 85"
        fill="#A78BFA"
      />
      
      {/* Worried eyes */}
      <motion.g
        animate={{ y: [0, 2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ellipse cx="75" cy="95" rx="8" ry="10" fill="#2D2D2D" />
        <ellipse cx="125" cy="95" rx="8" ry="10" fill="#2D2D2D" />
      </motion.g>
      
      {/* Worried eyebrows */}
      <path d="M 65 85 Q 75 80 85 85" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 115 85 Q 125 80 135 85" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      {/* Nervous mouth */}
      <path
        d="M 80 120 Q 100 118 120 120"
        stroke="#2D2D2D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Sweat drops */}
      <motion.circle
        cx="140"
        cy="110"
        r="4"
        fill="#60A5FA"
        animate={{ y: [0, 20], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.svg>
  );
}

export function ExcitedCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ 
        y: [0, -15, 0],
        rotate: [0, 3, -3, 0]
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#FFEBE5" />
      
      {/* Hair with bouncy strands */}
      <motion.path
        d="M 30 90 Q 20 45 50 35 Q 70 25 100 30 Q 130 25 150 35 Q 180 45 170 90"
        fill="#FF9E80"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Excited wide eyes */}
      <circle cx="75" cy="95" r="12" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <circle cx="125" cy="95" r="12" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <motion.circle
        cx="77"
        cy="95"
        r="6"
        fill="#2D2D2D"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <motion.circle
        cx="127"
        cy="95"
        r="6"
        fill="#2D2D2D"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      
      {/* Big happy smile */}
      <path
        d="M 65 110 Q 100 140 135 110"
        stroke="#2D2D2D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Blush */}
      <ellipse cx="55" cy="110" rx="15" ry="10" fill="#FF6B9D" opacity="0.4" />
      <ellipse cx="145" cy="110" rx="15" ry="10" fill="#FF6B9D" opacity="0.4" />
      
      {/* Energy stars */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '50px 50px' }}
      >
        <circle cx="50" cy="50" r="4" fill="#FFD700" />
      </motion.g>
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '150px 50px' }}
      >
        <circle cx="150" cy="50" r="4" fill="#FFD700" />
      </motion.g>
    </motion.svg>
  );
}

export function SadCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#E5F0FF" />
      
      {/* Hair */}
      <path
        d="M 35 85 Q 25 50 55 40 Q 75 30 100 35 Q 125 30 145 40 Q 175 50 165 85"
        fill="#7EC8E3"
      />
      
      {/* Sad eyes */}
      <motion.ellipse
        cx="75"
        cy="95"
        rx="6"
        ry="8"
        fill="#2D2D2D"
        animate={{ scaleY: [1, 0.8, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.ellipse
        cx="125"
        cy="95"
        rx="6"
        ry="8"
        fill="#2D2D2D"
        animate={{ scaleY: [1, 0.8, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Sad eyebrows */}
      <path d="M 65 88 Q 75 85 85 88" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 115 88 Q 125 85 135 88" stroke="#2D2D2D" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      
      {/* Sad mouth */}
      <path
        d="M 75 125 Q 100 118 125 125"
        stroke="#2D2D2D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Tear */}
      <motion.path
        d="M 135 100 Q 137 105 135 110 Q 133 105 135 100 Z"
        fill="#60A5FA"
        animate={{ y: [0, 30], opacity: [1, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
    </motion.svg>
  );
}

export function ConfusedCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ rotate: [0, -3, 3, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#FFF5E5" />
      
      {/* Hair - messy */}
      <path
        d="M 30 90 Q 20 50 50 40 L 60 30 L 70 35 L 80 25 L 90 30 L 100 20 L 110 30 L 120 25 L 130 35 L 140 30 L 150 40 Q 180 50 170 90"
        fill="#C4B5FD"
      />
      
      {/* Confused eyes - different sizes */}
      <circle cx="75" cy="95" r="10" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <circle cx="125" cy="95" r="8" fill="white" stroke="#2D2D2D" strokeWidth="2" />
      <circle cx="75" cy="95" r="5" fill="#2D2D2D" />
      <circle cx="125" cy="95" r="4" fill="#2D2D2D" />
      
      {/* Confused eyebrows */}
      <path d="M 65 85 L 85 80" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 135 80 L 115 85" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Confused mouth */}
      <motion.path
        d="M 85 120 Q 100 125 115 120"
        stroke="#2D2D2D"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        animate={{ d: ['M 85 120 Q 100 125 115 120', 'M 85 125 Q 100 120 115 125', 'M 85 120 Q 100 125 115 120'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Question marks */}
      <motion.text
        x="150"
        y="70"
        fontSize="24"
        fill="#C4B5FD"
        animate={{ opacity: [0.5, 1, 0.5], y: [70, 65, 70] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ?
      </motion.text>
    </motion.svg>
  );
}

export function AngryCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face - red tint */}
      <circle cx="100" cy="100" r="70" fill="#FFE5E5" />
      
      {/* Hair - spiky when angry */}
      <path
        d="M 30 90 L 25 70 L 30 60 L 35 50 L 45 35 L 55 30 L 65 25 L 75 23 L 85 22 L 95 20 L 105 20 L 115 22 L 125 23 L 135 25 L 145 30 L 155 35 L 165 50 L 170 60 L 175 70 L 170 90"
        fill="#EF4444"
      />
      
      {/* Angry eyes */}
      <ellipse cx="75" cy="95" rx="8" ry="10" fill="#2D2D2D" />
      <ellipse cx="125" cy="95" rx="8" ry="10" fill="#2D2D2D" />
      
      {/* Angry eyebrows */}
      <motion.path
        d="M 60 85 L 85 90"
        stroke="#2D2D2D"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      <motion.path
        d="M 140 85 L 115 90"
        stroke="#2D2D2D"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      
      {/* Angry mouth */}
      <path
        d="M 80 125 Q 100 120 120 125"
        stroke="#2D2D2D"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Steam puffs */}
      <motion.circle
        cx="50"
        cy="70"
        r="5"
        fill="#EF4444"
        opacity="0.6"
        animate={{ y: [0, -20], opacity: [0.6, 0], scale: [1, 1.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="150"
        cy="70"
        r="5"
        fill="#EF4444"
        opacity="0.6"
        animate={{ y: [0, -20], opacity: [0.6, 0], scale: [1, 1.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
      />
    </motion.svg>
  );
}

export function SleepyCharacter() {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ rotate: [0, -2, 2, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Face */}
      <circle cx="100" cy="100" r="70" fill="#F3E5FF" />
      
      {/* Hair - messy/bed head */}
      <path
        d="M 30 85 Q 20 50 45 40 Q 55 35 65 38 Q 75 30 85 32 Q 95 28 105 32 Q 115 28 125 32 Q 135 30 145 38 Q 155 35 165 40 Q 190 50 170 85"
        fill="#DDD6FE"
      />
      
      {/* Sleepy closed eyes */}
      <motion.g
        animate={{ scaleY: [1, 0.3, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <path d="M 65 95 Q 75 92 85 95" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M 115 95 Q 125 92 135 95" stroke="#2D2D2D" strokeWidth="3" fill="none" strokeLinecap="round" />
      </motion.g>
      
      {/* Sleepy smile */}
      <path
        d="M 85 120 Q 100 123 115 120"
        stroke="#2D2D2D"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Z's for sleep */}
      <motion.g
        animate={{ y: [0, -30], opacity: [1, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <text x="145" y="70" fontSize="20" fill="#DDD6FE">Z</text>
      </motion.g>
      <motion.g
        animate={{ y: [0, -30], opacity: [1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        <text x="160" y="55" fontSize="16" fill="#DDD6FE">z</text>
      </motion.g>
      <motion.g
        animate={{ y: [0, -30], opacity: [1, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      >
        <text x="170" y="45" fontSize="12" fill="#DDD6FE">z</text>
      </motion.g>
    </motion.svg>
  );
}
