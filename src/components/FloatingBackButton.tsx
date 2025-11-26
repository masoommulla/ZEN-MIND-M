import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';

interface FloatingBackButtonProps {
  onBack: () => void;
  onHome?: () => void;
  label?: string;
}

export function FloatingBackButton({ onBack, onHome, label = 'Back' }: FloatingBackButtonProps) {
  return (
    <div className="fixed top-20 md:top-24 left-4 md:left-6 z-[100] flex gap-2 md:gap-3">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -100, rotateY: -90 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ 
          type: 'spring', 
          damping: 15,
          delay: 0.2 
        }}
        whileHover={{ 
          scale: 1.1, 
          rotateY: 10,
          boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)' 
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="group relative px-4 md:px-6 py-2 md:py-3 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 text-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* 3D Inner shadow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl md:rounded-2xl" 
          style={{ transform: 'translateZ(-10px)' }}
        />
        
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-400/0 via-pink-400/50 to-blue-400/0"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-1.5 md:gap-2">
          <motion.div
            animate={{ x: [-2, 0, -2] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          </motion.div>
          <span className="hidden sm:inline text-sm md:text-base">{label}</span>
        </span>
        
        {/* 3D Border effect */}
        <div 
          className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-white/30"
          style={{ transform: 'translateZ(5px)' }}
        />
        
        {/* Floating particles on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: '50%',
              }}
              animate={{
                y: [-20, -40],
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
        </motion.div>
      </motion.button>

      {/* Home Button */}
      {onHome && (
        <motion.button
          initial={{ opacity: 0, x: -100, rotateY: -90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 15,
            delay: 0.3 
          }}
          whileHover={{ 
            scale: 1.1, 
            rotate: 360,
            boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' 
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onHome}
          className="relative p-2 md:p-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl md:rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1000px'
          }}
        >
          <Home className="w-4 h-4 md:w-5 md:h-5 relative z-10" />
          
          {/* Rotating glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.button>
      )}
    </div>
  );
}
