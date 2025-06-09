const config = {
  apiUrl: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://anonzon-sol.onrender.com/api'  // Production API URL
      : 'http://localhost:4000/api'),           // Development API URL
  
  // Add other configuration values here
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
};

export default config; 