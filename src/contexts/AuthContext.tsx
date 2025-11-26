import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, userAPI } from '../services/api';
import { toast } from 'sonner';
import { cleanupBotpress, initializeBotpress } from '../utils/botpress';

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  age: number;
  avatar?: string;
  role: string;
  createdAt: string;
  settings?: any;
  subscription?: any;
  streakCount?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, age: number) => Promise<void>;
  logout: () => void;
  updateUser: (data: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await authAPI.verify();
      if (response.success && response.data && response.data.user) {
        // Add id field for backward compatibility
        const userData = {
          ...response.data.user,
          id: response.data.user._id || response.data.user.id
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      } else {
        // Invalid token, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    } catch (error) {
      // Token is invalid or expired, clear it silently
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login...', { email });
      const response = await authAPI.login({ email, password });
      console.log('📥 Login response:', response);
      
      // Backend returns { success, data: { user, token } }
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        if (userData && token) {
          // Save token to localStorage FIRST
          localStorage.setItem('token', token);
          console.log('✅ Token saved to localStorage');
          
          // Then save user data
          const userWithId = {
            ...userData,
            id: userData._id || userData.id
          };
          setUser(userWithId);
          console.log('✅ User state updated:', userWithId.name);
          localStorage.setItem('currentUser', JSON.stringify(userWithId));
          toast.success('Welcome back! 👋');
        } else {
          console.error('❌ Missing user or token in response.data');
        }
      } else {
        console.error('❌ Invalid response:', response);
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, age: number) => {
    try {
      console.log('📝 Attempting registration...', { name, email, age });
      const response = await authAPI.register({ name, email, password, age });
      console.log('📥 Registration response:', response);
      
      // Backend returns { success, data: { user, token } }
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        
        if (userData && token) {
          // Save token to localStorage FIRST
          localStorage.setItem('token', token);
          console.log('✅ Token saved to localStorage');
          
          // Then save user data
          const userWithId = {
            ...userData,
            id: userData._id || userData.id
          };
          setUser(userWithId);
          console.log('✅ User state updated:', userWithId.name);
          localStorage.setItem('currentUser', JSON.stringify(userWithId));
          toast.success('Account created successfully! 🎉');
        } else {
          console.error('❌ Missing user or token in response.data');
        }
      } else {
        console.error('❌ Invalid response:', response);
      }
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
    
    // Clear Botpress storage to prevent chat leakage between users
    try {
      cleanupBotpress();
      console.log('🧹 Botpress storage cleared on logout');
    } catch (error) {
      console.error('Error clearing Botpress storage:', error);
    }
    
    toast.success('Logged out successfully! Come back soon! 💜');
  };

  const updateUser = async (data: any) => {
    try {
      const response = await userAPI.updateProfile(data);
      if (response.success && response.data) {
        const userData = {
          ...response.data,
          id: response.data._id || response.data.id
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        toast.success('Profile updated successfully! ✨');
      }
    } catch (error: any) {
      console.error('Update user error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.success && response.data) {
        const userData = {
          ...response.data,
          id: response.data._id || response.data.id
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};