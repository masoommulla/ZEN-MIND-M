import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Calendar, Eye, EyeOff, Sparkles, KeyRound, ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { HappyCharacter, ChatbotMascot } from './AnimeCharacters';
import { SparkleEffect } from './DecorativeElements';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { authAPI } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSuccess: (user: any) => void;
  onToggleMode: () => void;
}

export function AuthModal({ isOpen, onClose, mode, onSuccess, onToggleMode }: AuthModalProps) {
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password States
  const [forgotPasswordMode, setForgotPasswordMode] = useState<'email' | 'otp' | 'reset' | null>(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup') {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
      if (!formData.age || parseInt(formData.age) < 13 || parseInt(formData.age) > 19) {
        newErrors.age = 'Age must be between 13-19';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms';
      }
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    // Strong password validation
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /\d/.test(formData.password);
      const hasSpecialChar = /[@$!%*?&]/.test(formData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        newErrors.password = 'Password must contain uppercase, lowercase, number and special character (@$!%*?&)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        console.log('🔐 Modal: Calling login...');
        await login(formData.email, formData.password);
        console.log('✅ Modal: Login successful');
      } else {
        console.log('📝 Modal: Calling register...');
        await register(formData.name, formData.email, formData.password, parseInt(formData.age));
        console.log('✅ Modal: Register successful');
      }
      
      // Success! Close modal
      console.log('🚪 Modal: Closing and calling onSuccess...');
      onClose();
      
      // Call onSuccess to trigger navigation
      // Small delay to ensure auth state is updated
      setTimeout(() => {
        onSuccess(null);
      }, 100);
    } catch (error: any) {
      // Error is already handled by AuthContext (toast shown)
      console.error('❌ Modal: Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.forgotPassword(forgotEmail);
      toast.success('OTP sent to your email');
      setForgotPasswordMode('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.verifyOtp(forgotEmail, otp);
      toast.success('OTP verified successfully!');
      setForgotPasswordMode('reset');
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmNewPassword || newPassword !== confirmNewPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[@$!%*?&]/.test(newPassword);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      toast.error('Password must contain uppercase, lowercase, number and special character (@$!%*?&)');
      return;
    }

    setIsLoading(true);
    try {
      await authAPI.resetPassword(forgotEmail, newPassword);
      toast.success('Password reset successfully! You can now login.');
      setForgotPasswordMode(null);
      setForgotEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(90vh-4rem)] pr-1 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-12 h-12 pointer-events-none">
          <SparkleEffect />
        </div>

        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-3">
            <motion.div
              className="w-16 h-16"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ChatbotMascot />
            </motion.div>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome Back!' : 'Join ZEN-MIND'}
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            {mode === 'login' ? 'Sign in to your ZEN-MIND account' : 'Create a new ZEN-MIND account'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-2"
            >
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </motion.div>

          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <Label htmlFor="age">Age</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="age"
                  type="number"
                  placeholder="13-19"
                  className="pl-10"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: mode === 'signup' ? 0.3 : 0.2 }}
            className="space-y-2"
          >
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === 'signup' && !errors.password && (
              <p className="text-xs text-gray-500">
                8+ characters, uppercase, lowercase, number & special char (@$!%*?&)
              </p>
            )}
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </motion.div>

          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            </motion.div>
          )}

          {mode === 'signup' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the Terms & Conditions
              </label>
            </motion.div>
          )}
          {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: mode === 'signup' ? 0.6 : 0.3 }}
          >
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90"
              disabled={isLoading}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </motion.div>

          <div className="text-center text-sm text-gray-600">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-purple-500 hover:text-purple-600 font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Forgot Password Form */}
        {mode === 'login' && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setForgotPasswordMode('email')}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Forgot Password?
            </button>
          </div>
        )}

        {forgotPasswordMode === 'email' && (
          <form onSubmit={handleForgotPassword} className="space-y-4 mt-4">
            <Label htmlFor="forgotEmail">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="forgotEmail"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90"
              disabled={isLoading}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Send OTP
            </Button>

            <button
              type="button"
              onClick={() => setForgotPasswordMode(null)}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Login
            </button>
          </form>
        )}

        {forgotPasswordMode === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 mt-4">
            <Label htmlFor="otp">OTP</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                className="pl-10"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90"
              disabled={isLoading}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Verify OTP
            </Button>

            <button
              type="button"
              onClick={() => setForgotPasswordMode('email')}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Email
            </button>
          </form>
        )}

        {forgotPasswordMode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-10 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword.length < 8 && (
              <p className="text-xs text-gray-500">
                8+ characters, uppercase, lowercase, number & special char (@$!%*?&)
              </p>
            )}

            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmNewPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:opacity-90"
              disabled={isLoading}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Reset Password
            </Button>

            <button
              type="button"
              onClick={() => setForgotPasswordMode('email')}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Email
            </button>
          </form>
        )}
        </div>

        {/* Decorative character */}
        <motion.div
          className="absolute -bottom-4 -right-4 w-24 h-24 pointer-events-none"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <HappyCharacter />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}