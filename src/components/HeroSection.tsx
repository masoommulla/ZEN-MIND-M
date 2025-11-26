import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Sparkles, Video, Heart, ArrowRight, Shield, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const heroSlides = [
  {
    id: 1,
    badge: 'AI-Powered Mental Wellness',
    badgeIcon: Sparkles,
    title: 'Your Mind,',
    titleGradient: 'Your Safe Space',
    description: 'A safe space where teens can explore their emotions, find support, and grow mentally stronger with AI-powered companionship.',
    image: 'https://images.unsplash.com/photo-1588787470976-43355cc28222?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjB3ZWxsbmVzcyUyMG1lZGl0YXRpb24lMjBwZWFjZWZ1bCUyMHRlZW58ZW58MXx8fHwxNzY0MTU2NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradientFrom: 'from-purple-500',
    gradientVia: 'via-pink-500',
    gradientTo: 'to-blue-500',
  },
  {
    id: 2,
    badge: 'Professional Support',
    badgeIcon: Video,
    title: 'Connect with',
    titleGradient: 'Expert Therapists',
    description: 'Book instant video sessions with certified mental health professionals. Anonymous, secure, and available when you need support the most.',
    image: 'https://images.unsplash.com/photo-1758274538961-fe8f1f24166f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFjZWZ1bCUyMHRoZXJhcHklMjBtZWRpdGF0aW9ufGVufDF8fHx8MTc2NDE1NjgyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradientFrom: 'from-blue-500',
    gradientVia: 'via-cyan-500',
    gradientTo: 'to-teal-500',
  },
  {
    id: 3,
    badge: 'Emotional Intelligence',
    badgeIcon: Heart,
    title: 'Track & Understand',
    titleGradient: 'Your Emotions',
    description: 'Daily mood tracking with personalized insights. Understand your emotional patterns and receive AI-powered suggestions for better mental wellness.',
    image: 'https://images.unsplash.com/photo-1758272959994-f1a4beffa257?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRlZW5zJTIwZ3JvdXAlMjBmcmllbmRzfGVufDF8fHx8MTc2NDE1NjgyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    gradientFrom: 'from-pink-500',
    gradientVia: 'via-rose-500',
    gradientTo: 'to-orange-500',
  },
];

const quickLinks = [
  { icon: Sparkles, label: 'Features', href: '#features' },
  { icon: Users, label: 'About', href: '#about' },
  { icon: Shield, label: 'Safe Space', href: '#safe-space' },
];

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000); // Changed to 7 seconds

    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];
  const BadgeIcon = slide.badgeIcon;

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Full-Screen Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <ImageWithFallback
            src={slide.image}
            alt={slide.badge}
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
          {/* Gradient Overlay matching slide theme */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${slide.gradientFrom}/30 ${slide.gradientTo}/20`} />
        </motion.div>
      </AnimatePresence>

      {/* Content Container - Desktop: Centered, Mobile: Normal Layout */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop: Centered Content */}
          <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto pt-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-3 rounded-full border border-white/30"
                >
                  <BadgeIcon className="w-5 h-5 text-white" />
                  <span className="text-white">
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Title */}
                <div className="space-y-2">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-6xl lg:text-7xl xl:text-8xl"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white text-6xl lg:text-7xl xl:text-8xl drop-shadow-2xl"
                  >
                    {slide.titleGradient}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-white/90 text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onGetStarted}
                    className="group relative px-10 py-5 bg-white text-gray-900 rounded-2xl shadow-2xl hover:shadow-white/20 transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      <MessageCircle className="w-6 h-6" />
                      Start Your Journey
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradientFrom} ${slide.gradientVia} ${slide.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators */}
            <div className="flex gap-3 pt-8">
              {heroSlides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className="group relative"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? 'w-16 bg-white shadow-lg shadow-white/50'
                        : 'w-10 bg-white/40'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Mobile: Traditional Layout */}
          <div className="lg:hidden flex flex-col justify-end h-full pb-20 pt-24 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 text-center"
              >
                {/* Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30"
                >
                  <BadgeIcon className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">
                    {slide.badge}
                  </span>
                </motion.div>

                {/* Title */}
                <div className="space-y-1">
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-white text-4xl sm:text-5xl"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white text-4xl sm:text-5xl drop-shadow-2xl"
                  >
                    {slide.titleGradient}
                  </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/90 text-base sm:text-lg px-4"
                >
                  {slide.description}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-2"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onGetStarted}
                    className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-2xl shadow-2xl"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Slide Indicators - Mobile */}
            <div className="flex gap-2 justify-center">
              {heroSlides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === currentSlide
                        ? 'w-12 bg-white'
                        : 'w-8 bg-white/50'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-white/80"
        >
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}