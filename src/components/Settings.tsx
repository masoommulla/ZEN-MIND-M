import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Lock, 
  Phone, 
  Calendar, 
  Camera,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  Home,
  KeyRound,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, authAPI } from '../services/api';
import { HappyCharacter } from './AnimeCharacters';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const navigate = useNavigate();
  const { user, updateUser, refreshUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot Password States
  const [forgotPasswordMode, setForgotPasswordMode] = useState<'email' | 'otp' | 'reset' | null>(null);
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPasswordForgot, setNewPasswordForgot] = useState('');
  const [confirmNewPasswordForgot, setConfirmNewPasswordForgot] = useState('');
  const [showNewPasswordForgot, setShowNewPasswordForgot] = useState(false);

  const [tempProfile, setTempProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    gender: user?.profile?.gender || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Update temp profile when user changes
  useEffect(() => {
    if (user) {
      setTempProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        gender: user.profile?.gender || '',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // Validation
    if (!tempProfile.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!tempProfile.email.trim() || !tempProfile.email.includes('@')) {
      toast.error('Valid email is required');
      return;
    }
    if (tempProfile.phone) {
      // Indian phone number validation
      // Remove +91 if present for validation
      const phoneNumber = tempProfile.phone.replace(/^\+91\s*/, '').replace(/\s+/g, '');
      
      // Check if it's exactly 10 digits
      if (!/^\d{10}$/.test(phoneNumber)) {
        toast.error('Phone number must be exactly 10 digits');
        return;
      }
      
      // Check if it starts with 9, 8, 7, or 6
      const firstDigit = phoneNumber.charAt(0);
      if (!['9', '8', '7', '6'].includes(firstDigit)) {
        toast.error('Phone number must start with 9, 8, 7, or 6');
        return;
      }
    }

    setLoading(true);
    try {
      await updateUser({
        name: tempProfile.name,
        email: tempProfile.email,
        profile: {
          phone: tempProfile.phone,
          gender: tempProfile.gender,
        }
      });
      
      setEditMode(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Current password is required');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success('Password updated successfully! 🔐');
      setPasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setTempProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        gender: user.profile?.gender || '',
      });
    }
    setEditMode(false);
  };

  const handleCancelPassword = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMode(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const avatarUrl = reader.result as string;
      setLoading(true);
      try {
        const response = await userAPI.updateAvatar(avatarUrl);
        if (response.success && response.data) {
          await refreshUser();
          toast.success('Avatar updated successfully! 🎨');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to update avatar');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Forgot Password Functions
  const handleForgotPasswordEmail = async () => {
    // Use the user's email by default
    const emailToUse = forgotEmail || user?.email || '';
    
    if (!emailToUse.trim() || !emailToUse.includes('@')) {
      toast.error('Valid email is required');
      return;
    }

    setLoading(true);
    try {
      await authAPI.forgotPassword(emailToUse);
      toast.success('OTP sent to your email!');
      setForgotEmail(emailToUse);
      setForgotPasswordMode('otp');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await authAPI.verifyOtp(forgotEmail, otp);
      toast.success('OTP verified successfully!');
      setForgotPasswordMode('reset');
    } catch (error: any) {
      toast.error(error.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordReset = async () => {
    if (!newPasswordForgot) {
      toast.error('New password is required');
      return;
    }
    if (newPasswordForgot.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    const hasUpperCase = /[A-Z]/.test(newPasswordForgot);
    const hasLowerCase = /[a-z]/.test(newPasswordForgot);
    const hasNumber = /\d/.test(newPasswordForgot);
    const hasSpecialChar = /[@$!%*?&]/.test(newPasswordForgot);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      toast.error('Password must contain uppercase, lowercase, number and special character (@$!%*?&)');
      return;
    }

    if (newPasswordForgot !== confirmNewPasswordForgot) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword(forgotEmail, newPasswordForgot);
      toast.success('Password reset successfully! 🔐');
      setPasswordMode(false);
      setForgotPasswordMode(null);
      setForgotEmail('');
      setOtp('');
      setNewPasswordForgot('');
      setConfirmNewPasswordForgot('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pt-6 pb-8 overflow-hidden">
      {/* Home Icon - Top Left */}
      <motion.button
        onClick={() => navigate('/dashboard')}
        className="fixed top-6 left-6 z-50 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-6 h-6 text-purple-600" />
      </motion.button>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent">
            Settings & Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account and preferences
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Picture & Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="border-2 border-purple-100 shadow-lg">
                <CardContent className="p-6">
                  {/* Profile Picture */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <motion.div
                        className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center border-4 border-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HappyCharacter />
                          </div>
                        )}
                      </motion.div>
                    </div>

                    <h2 className="mt-4 text-xl">{user?.name || 'User'}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                    
                    {/* Upload Avatar Button */}
                    <div className="mt-4">
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      <Button
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        variant="outline"
                        size="sm"
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Quick Stats */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Account Status</p>
                        <p className="text-gray-600">Active</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Member Since</p>
                        <p className="text-gray-600">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">Role</p>
                        <p className="text-gray-600 capitalize">{user?.role || 'User'}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
            </Card>
          </motion.div>

          {/* Right Column - Edit Forms */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Profile Information Card */}
            <Card className="border-2 border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Profile Information</span>
                  {!editMode && (
                    <Button
                      onClick={() => setEditMode(true)}
                      className="bg-gradient-to-r from-purple-500 to-pink-500"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={tempProfile.name}
                      onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempProfile.email}
                      onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 9876543210 (Optional)"
                      value={tempProfile.phone}
                      onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                      disabled={!editMode}
                    />
                    {editMode && (
                      <p className="text-xs text-gray-500">
                        Enter 10-digit mobile number starting with 9, 8, 7, or 6
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={tempProfile.gender}
                      onValueChange={(value) => setTempProfile({ ...tempProfile, gender: value })}
                      disabled={!editMode}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      value={user?.age || 'N/A'}
                      disabled
                    />
                  </div>
                </div>

                {editMode && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={loading}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Change Card */}
            <Card className="border-2 border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Change Password</span>
                  {!passwordMode && (
                    <Button
                      onClick={() => setPasswordMode(true)}
                      variant="outline"
                      className="border-purple-500 text-purple-500"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordMode ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="current-password">Current Password</Label>
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordMode(false);
                            setForgotPasswordMode('email');
                            setForgotEmail(user?.email || '');
                          }}
                          className="text-sm text-purple-600 hover:text-purple-700 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">Must be at least 6 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleChangePassword}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {loading ? 'Updating...' : 'Update Password'}
                      </Button>
                      <Button
                        onClick={handleCancelPassword}
                        variant="outline"
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">
                    Your password is securely encrypted. Click "Change Password" to update it.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Forgot Password Card */}
            <Card className="border-2 border-purple-100 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Forgot Password</span>
                  {!forgotPasswordMode && (
                    <Button
                      onClick={() => setForgotPasswordMode('email')}
                      variant="outline"
                      className="border-purple-500 text-purple-500"
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Forgot Password
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {forgotPasswordMode === 'email' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleForgotPasswordEmail}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {loading ? 'Sending...' : 'Send OTP'}
                      </Button>
                      <Button
                        onClick={() => setForgotPasswordMode(null)}
                        variant="outline"
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : forgotPasswordMode === 'otp' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleForgotPasswordOtp}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                      <Button
                        onClick={() => setForgotPasswordMode(null)}
                        variant="outline"
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : forgotPasswordMode === 'reset' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="new-password-forgot">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password-forgot"
                          type={showNewPasswordForgot ? 'text' : 'password'}
                          value={newPasswordForgot}
                          onChange={(e) => setNewPasswordForgot(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPasswordForgot(!showNewPasswordForgot)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPasswordForgot ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-sm text-gray-500">Must be at least 6 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password-forgot">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password-forgot"
                          type={showNewPasswordForgot ? 'text' : 'password'}
                          value={confirmNewPasswordForgot}
                          onChange={(e) => setConfirmNewPasswordForgot(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPasswordForgot(!showNewPasswordForgot)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showNewPasswordForgot ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleForgotPasswordReset}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 flex-1"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        {loading ? 'Resetting...' : 'Reset Password'}
                      </Button>
                      <Button
                        onClick={() => setForgotPasswordMode(null)}
                        variant="outline"
                        disabled={loading}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">
                    Enter your email to reset your password.
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}