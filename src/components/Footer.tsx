import { motion } from 'motion/react';
import { Heart, Shield, Mail, Phone, MapPin, Brain, Sparkles, AlertCircle, ArrowRight, Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#about' },
      { label: 'Therapists', href: '#therapists' },
      { label: 'Resources', href: '#resources' },
    ],
    support: [
      { label: 'Crisis Support', href: '#crisis' },
      { label: 'Help Center', href: '#faq' },
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
    company: [
      { label: 'About Us', href: '#about-us' },
      { label: 'Careers', href: '#careers' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contact', href: '#contact' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Emergency Crisis Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 p-8 bg-gradient-to-r from-red-500/30 via-rose-500/30 to-pink-500/30 backdrop-blur-sm rounded-3xl border border-red-400/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/50">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white mb-1">
                  <strong>In Crisis? You're Not Alone</strong>
                </p>
                <p className="text-sm text-gray-200">
                  24/7 helplines available for immediate support
                </p>
              </div>
            </div>
            <motion.a
              href="tel:+919820466726"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white text-red-600 rounded-xl hover:shadow-xl hover:shadow-red-500/30 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </motion.a>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 text-xs text-gray-200 text-center md:text-left">
            AASRA: <a href="tel:+919820466726" className="hover:text-white transition-colors font-medium">+91 98204 66726</a> | 
            Vandrevala Foundation: <a href="tel:18602662345" className="hover:text-white transition-colors ml-2 font-medium">1860 2662 345</a> | 
            iCall: <a href="tel:+912225521111" className="hover:text-white transition-colors ml-2 font-medium">+91 22 2552 1111</a>
          </div>
        </motion.div>

        {/* Large Brand Name - Modern Website Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-7xl md:text-9xl lg:text-[12rem] bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent tracking-tight leading-none mb-4">
            ZENMIND
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
            Empowering teens with AI-powered mental wellness support
          </p>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" fill="currentColor" />
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-5 group-hover:ml-0 transition-all" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white mb-4">Connect With Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                </motion.a>
              ))}
            </div>
            <p className="text-gray-300 text-sm mt-6 leading-relaxed">
              Join our community and stay updated with the latest features and mental wellness tips.
            </p>
          </motion.div>
        </div>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center gap-3 hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Email Us</p>
              <p className="text-sm text-white">zenmindteam@gmail.com</p>
            </div>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center gap-3 hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Call Us</p>
              <p className="text-sm text-white">+91 0123456789</p>
            </div>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center gap-3 hover:bg-white/15 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/30">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="text-sm text-white">Available Nationwide</p>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Your privacy and security are our top priority</span>
            </div>
            <div className="text-sm text-gray-300">
              © {currentYear} ZEN-MIND. All rights reserved. Made with <Heart className="w-3 h-3 inline text-pink-400" fill="currentColor" /> for teens.
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}