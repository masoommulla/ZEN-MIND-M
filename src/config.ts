// API URL Configuration
// Environment variable should be set in Render dashboard as VITE_API_URL

// For development: http://localhost:5000
// For production: Your backend URL on Render (e.g., https://your-backend.onrender.com)

// Vite exposes environment variables that start with VITE_ to the client
// Safety check for import.meta.env
const getApiUrl = () => {
  // Check if import.meta.env exists (Vite environment)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_API_URL || 'http://localhost:5000';
  }
  // Fallback for non-Vite environments
  return 'http://localhost:5000';
};

export const API_URL = getApiUrl();

console.log("🚀 API_URL:", API_URL);
if (typeof import.meta !== 'undefined' && import.meta.env) {
  console.log("🌍 Environment:", import.meta.env.MODE);
}