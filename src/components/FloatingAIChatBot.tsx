import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Sparkles, Heart } from 'lucide-react';

interface FloatingAIChatBotProps {
  onChatOpen: () => void;
}

export function FloatingAIChatBot({ onChatOpen }: FloatingAIChatBotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide tooltip after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Size based on device
  const botSize = isMobile ? 'w-16 h-20' : 'w-24 h-28 md:w-32 md:h-36';

  return (
    <>
      {/* Floating Bot Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0, x: 100, y: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 100,
          delay: 1
        }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
      >
        {/* Glow Ring */}
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.15, 1] : [1, 1.08, 1],
            opacity: isHovered ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 blur-xl md:blur-2xl"
          style={{ transform: 'translate(-15%, -15%)', width: '130%', height: '130%' }}
        />

        {/* Cute 2D Robot Character */}
        <motion.div
          animate={{
            y: isHovered ? [-3, 3, -3] : [0, -8, 0],
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ 
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            scale: { type: 'spring', stiffness: 300, damping: 20 }
          }}
          className={`relative ${botSize} cursor-pointer`}
          onClick={onChatOpen}
        >
          {/* Robot Body */}
          <div className="relative w-full h-full">
            {/* Head */}
            <motion.div
              animate={{
                rotate: isHovered ? [-3, 3, -3] : [0, 0, 0]
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-14 md:w-20 md:h-20"
            >
              <div className="relative w-full h-full bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-2xl shadow-2xl"
                style={{
                  boxShadow: `
                    0 10px 30px rgba(168, 85, 247, 0.5),
                    inset 0 -5px 15px rgba(0, 0, 0, 0.2),
                    inset 0 5px 15px rgba(255, 255, 255, 0.3)
                  `
                }}
              >
                {/* Face Panel */}
                <div className="absolute inset-2 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl overflow-hidden">
                  {/* Eyes */}
                  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3">
                    <motion.div
                      animate={{
                        scaleY: isHovered ? [1, 0.1, 1] : [1, 0.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full shadow-lg"
                      style={{
                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
                      }}
                    />
                    <motion.div
                      animate={{
                        scaleY: isHovered ? [1, 0.1, 1] : [1, 0.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2
                      }}
                      className="w-2 h-2 md:w-3 md:h-3 bg-cyan-400 rounded-full shadow-lg"
                      style={{
                        boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)'
                      }}
                    />
                  </div>

                  {/* Smile */}
                  <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-6 md:w-8 h-2 md:h-3 border-b-2 border-white rounded-full" />
                </div>

                {/* Antenna */}
                <motion.div
                  animate={{
                    rotate: isHovered ? [-10, 10, -10] : [0, 0, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }}
                  className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2"
                >
                  <div className="w-1 md:w-1.5 h-4 md:h-6 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full" />
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.6, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-yellow-400 rounded-full"
                    style={{
                      boxShadow: '0 0 15px rgba(251, 191, 36, 0.9)'
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Body */}
            <div className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 w-12 h-10 md:w-16 md:h-14 bg-gradient-to-br from-indigo-400 via-indigo-500 to-indigo-600 rounded-2xl shadow-xl"
              style={{
                boxShadow: `
                  0 8px 25px rgba(99, 102, 241, 0.4),
                  inset 0 -4px 10px rgba(0, 0, 0, 0.2),
                  inset 0 4px 10px rgba(255, 255, 255, 0.2)
                `
              }}
            >
              {/* Chest Panel */}
              <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: isHovered ? [1, 1.2, 1] : [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                >
                  <Heart className="w-3 h-3 md:w-5 md:h-5 text-pink-300 fill-pink-300" />
                </motion.div>
              </div>
            </div>

            {/* Arms */}
            <motion.div
              animate={{
                rotate: isHovered ? [-20, -10, -20] : [0, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              className="absolute top-11 md:top-16 -left-1 md:-left-2 w-2 md:w-3 h-6 md:h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full shadow-lg"
            />
            <motion.div
              animate={{
                rotate: isHovered ? [20, 10, 20] : [0, 5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              className="absolute top-11 md:top-16 -right-1 md:-right-2 w-2 md:w-3 h-6 md:h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full shadow-lg"
            />
          </div>
        </motion.div>

        {/* Floating Icons - Hidden on mobile */}
        <AnimatePresence>
          {isHovered && !isMobile && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ type: 'spring', damping: 15 }}
                className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Tooltip - Adjusted for mobile */}
        <AnimatePresence>
          {(showTooltip || isHovered) && !isMobile && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute right-full mr-2 md:mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
            >
              <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl shadow-2xl">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1.5 md:gap-2 text-xs md:text-base"
                >
                  <MessageCircle className="w-3 h-3 md:w-5 md:h-5" />
                  <span>Chat with ZEN AI!</span>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  </motion.div>
                </motion.div>
                
                {/* Arrow */}
                <div className="absolute top-1/2 -right-1.5 md:-right-2 -translate-y-1/2 w-0 h-0 border-t-4 md:border-t-8 border-t-transparent border-b-4 md:border-b-8 border-b-transparent border-l-4 md:border-l-8 border-l-blue-600" />
              </div>

              {/* Close tooltip button */}
              {showTooltip && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                  className="absolute -top-1 md:-top-2 -right-1 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                >
                  <X className="w-2 h-2 md:w-3 md:h-3" />
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ripple Effect - Reduced on mobile */}
        {isHovered && !isMobile && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 top-8 rounded-full border-2 md:border-4 border-purple-500"
            style={{ pointerEvents: 'none' }}
          />
        )}
      </motion.div>

      {/* Sparkle particles around the bot - Reduced on mobile */}
      {!isMobile && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-16 h-20 md:w-24 md:h-28 lg:w-32 lg:h-36 pointer-events-none z-30">
          {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              animate={{
                x: [0, (Math.cos((i / (isMobile ? 4 : 8)) * Math.PI * 2) * (isMobile ? 40 : 60))],
                y: [0, (Math.sin((i / (isMobile ? 4 : 8)) * Math.PI * 2) * (isMobile ? 40 : 60))],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
