/**
 * Botpress utility functions for cleaning up chat storage
 * This prevents chat history from leaking between different users
 */

/**
 * Cleans up Botpress localStorage data
 * Called during logout to ensure chat history doesn't persist
 */
export const cleanupBotpress = () => {
  try {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Remove all Botpress-related keys
    keys.forEach(key => {
      if (
        key.startsWith('bp-') || 
        key.startsWith('botpress') || 
        key.includes('webchat') ||
        key.includes('conversation')
      ) {
        localStorage.removeItem(key);
      }
    });
    
    // Also clear sessionStorage
    const sessionKeys = Object.keys(sessionStorage);
    sessionKeys.forEach(key => {
      if (
        key.startsWith('bp-') || 
        key.startsWith('botpress') || 
        key.includes('webchat') ||
        key.includes('conversation')
      ) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log('✅ Botpress storage cleaned successfully');
  } catch (error) {
    console.error('Error cleaning Botpress storage:', error);
  }
};

/**
 * Initializes Botpress with user context
 * Can be called after login to set user-specific data
 */
export const initializeBotpress = (userId?: string, userName?: string) => {
  try {
    if (userId && userName) {
      // Store user context for Botpress
      localStorage.setItem('bp-user-id', userId);
      localStorage.setItem('bp-user-name', userName);
      console.log('✅ Botpress initialized for user:', userName);
    }
  } catch (error) {
    console.error('Error initializing Botpress:', error);
  }
};

/**
 * Gets the current user context for Botpress
 */
export const getBotpressUserContext = () => {
  try {
    const userId = localStorage.getItem('bp-user-id');
    const userName = localStorage.getItem('bp-user-name');
    
    return {
      userId: userId || undefined,
      userName: userName || undefined
    };
  } catch (error) {
    console.error('Error getting Botpress user context:', error);
    return {
      userId: undefined,
      userName: undefined
    };
  }
};
