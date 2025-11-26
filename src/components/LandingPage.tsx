import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { Footer } from './Footer';
import { LoadingScreen } from './LoadingScreen';
import {
  Heart,
  Shield,
  MessageCircle,
  Users,
  Sparkles,
  Lock,
  Star,
  Zap,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh
} from 'lucide-react';
import {
  HappyCharacter,
  CalmCharacter,
  ChatbotMascot,
  ThinkingCharacter,
  SupportiveCharacter
} from './AnimeCharacters';
import {
  CloudShape,
  HeartPulse,
  RainbowArc,
  SparkleEffect,
  BubbleChat
} from './DecorativeElements';

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Handle loading screen
  useEffect(() => {
    if (!authLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [authLoading]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup') => {
    if (mode === 'login') {
      navigate('/login');
    } else {
      navigate('/signup');
    }
  };

  // Show loading screen
  if (isLoading || authLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  const features = [
    {
      icon: Heart,
      title: '24/7 AI Support',
      description: 'Your personal mental wellness companion, always ready to listen and support you.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Shield,
      title: 'Safe & Private',
      description: 'Your data is encrypted and secure. We prioritize your privacy above everything.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageCircle,
      title: 'Professional Therapists',
      description: 'Connect with certified mental health professionals when you need human support.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Instant Response',
      description: 'No waiting, no judgment. Get immediate support when you need it most.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Users,
      title: 'Community Connection',
      description: 'Connect with others who understand, in a safe and moderated environment.',
      color: 'from-green-500 to-teal-500',
    },
  ];

  const moodCards = [
    {
      emoji: '😊',
      label: 'Happy',
      color: 'from-yellow-400 to-orange-400',
      icon: Smile,
    },
    {
      emoji: '😢',
      label: 'Sad',
      color: 'from-blue-400 to-cyan-400',
      icon: Frown,
    },
    {
      emoji: '😐',
      label: 'Neutral',
      color: 'from-gray-400 to-slate-400',
      icon: Meh,
    },
    {
      emoji: '😡',
      label: 'Angry',
      color: 'from-red-400 to-rose-400',
      icon: Angry,
    },
    {
      emoji: '😄',
      label: 'Excited',
      color: 'from-pink-400 to-purple-400',
      icon: Laugh,
    },
    {
      emoji: '😰',
      label: 'Anxious',
      color: 'from-purple-400 to-indigo-400',
      icon: Frown,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Header */}
      <Header 
        user={null}
        onLogin={() => handleOpenAuth('signup')}
        onLogout={() => {}}
        onNavigate={() => {}}
      />

      {/* Hero Section */}
      <section className="relative">
        <HeroSection onGetStarted={() => handleOpenAuth('signup')} />
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 rounded-full mb-8 border border-purple-100"
            >
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-purple-700">Why ZEN-MIND?</span>
            </motion.div>
            
            <h2 className="mb-6 text-gray-900">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              Combining AI technology with human expertise to provide comprehensive mental health support designed specifically for teens.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>

                {/* Decorative element */}
                <div className={`absolute -bottom-12 -right-12 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-700`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Express Your Feelings Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full mb-6"
            >
              <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
              <span className="text-pink-700">Track Your Emotions</span>
            </motion.div>
            
            <h2 className="mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Express Your Feelings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Log your mood daily and gain insights into your emotional patterns. Understanding your feelings is the first step to better mental health.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {moodCards.map((mood, index) => (
              <motion.div
                key={mood.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -10 }}
                className={`bg-gradient-to-br ${mood.color} rounded-3xl p-6 shadow-lg cursor-pointer transition-all duration-300 group`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {mood.emoji}
                  </div>
                  <p className="text-white text-sm">{mood.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenAuth('signup')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-2"
            >
              <Heart className="w-5 h-5" fill="currentColor" />
              Start Tracking Your Mood
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Safe Space Section */}
      <section id="safe-space" className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full mb-6"
            >
              <Shield className="w-4 h-4 text-blue-500" />
              <span className="text-blue-700">Your Safe Space</span>
            </motion.div>
            
            <h2 className="mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              A Judgment-Free Zone
            </h2>
            <p className="text-gray-600 mb-8">
              ZEN-MIND is your safe haven where you can express yourself freely without fear of judgment. Every conversation is private, secure, and confidential. We're here to listen, support, and guide you on your mental wellness journey.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 mx-auto">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-gray-800">100% Private</h3>
                <p className="text-gray-600 text-sm">Your conversations are encrypted and never shared with anyone.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto">
                  <Heart className="w-6 h-6 text-white" fill="currentColor" />
                </div>
                <h3 className="mb-2 text-gray-800">Non-Judgmental</h3>
                <p className="text-gray-600 text-sm">Share your thoughts and feelings without any fear of judgment.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="mb-2 text-gray-800">Always Available</h3>
                <p className="text-gray-600 text-sm">24/7 support whenever you need someone to talk to.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section with Characters */}
      <section id="about" className="relative py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="relative"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 shadow-lg">
                  <div className="w-full h-48">
                    <HappyCharacter />
                  </div>
                  <BubbleChat message="I feel understood!" className="mt-4 text-sm" />
                </div>
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-6 shadow-lg sm:mt-8">
                  <div className="w-full h-48">
                    <CalmCharacter />
                  </div>
                  <BubbleChat message="So peaceful..." className="mt-4 text-sm" />
                </div>
              </div>
              
              <SparkleEffect className="absolute -top-6 -right-6 w-20" />
              <HeartPulse className="absolute -bottom-6 -left-6 w-16" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-purple-700">About ZEN-MIND</span>
              </motion.div>

              <h2 className="mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                Your Personal Mental Wellness Companion
              </h2>

              <p className="text-gray-600 mb-6">
                ZEN-MIND combines cutting-edge AI technology with evidence-based therapeutic techniques to provide personalized mental health support. Whether you're dealing with stress, anxiety, or just need someone to talk to, we're here for you 24/7.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Anonymous and confidential support',
                  'Evidence-based coping strategies',
                  'Mood tracking and insights',
                  'Access to professional therapists',
                  'Personalized wellness journey'
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-gray-700"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Star className="w-3 h-3 text-white" fill="currentColor" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenAuth('signup')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white rounded-full hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-2xl inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Start Your Journey
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="relative py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring' }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full mb-6"
            >
              <Users className="w-4 h-4 text-pink-500" />
              <span className="text-pink-700">About Us</span>
            </motion.div>
            
            <h2 className="mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Built for Teens, By Mental Health Experts
            </h2>
            <p className="text-gray-600 mb-8">
              ZEN-MIND was created by a team of mental health professionals, AI experts, and teen advisors who understand the unique challenges teenagers face today. Our mission is to make mental wellness support accessible, friendly, and effective for every teen.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-left"
              >
                <h3 className="mb-4 text-gray-800">Our Mission</h3>
                <p className="text-gray-600">
                  To empower teenagers with the mental health tools and support they need to navigate life's challenges, build resilience, and thrive emotionally and mentally.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 text-left"
              >
                <h3 className="mb-4 text-gray-800">Our Values</h3>
                <p className="text-gray-600">
                  Privacy, accessibility, compassion, and evidence-based support. We believe every teenager deserves access to quality mental health resources in a safe, welcoming environment.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="w-24 h-24 mx-auto mb-8">
              <ChatbotMascot />
            </div>
            
            <h2 className="text-white mb-6">
              Ready to Take Control of Your Mental Wellness?
            </h2>
            
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of teens who are already on their journey to better mental health. It's free, private, and always here for you.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleOpenAuth('signup')}
              className="px-8 py-4 bg-white text-purple-600 rounded-full hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}