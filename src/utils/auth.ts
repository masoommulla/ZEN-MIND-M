// Authentication utility functions

import { authAPI } from '../services/api';

export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  age?: number;
  avatar?: string;
  role?: string;
  createdAt?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('currentUser');
  return !!(token && user);
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set user and token
export const setAuthData = (user: User, token: string): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('token', token);
};

// Clear auth data (logout)
export const clearAuthData = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// Verify token with backend
export const verifyToken = async (): Promise<User | null> => {
  try {
    const token = getToken();
    if (!token) return null;

    const response = await authAPI.verify();
    if (response.success && response.user) {
      // Update local storage with fresh user data
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      return response.user;
    }
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    clearAuthData();
    return null;
  }
};

// Initialize auth state on app load
export const initializeAuth = async (): Promise<User | null> => {
  if (!isAuthenticated()) {
    return null;
  }

  // Verify token is still valid
  return await verifyToken();
};
