import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global error handler to prevent blank pages
window.onerror = function(message, source, lineno, colno, error) {
  console.error('Global error:', { message, source, lineno, colno, error });
  
  const root = document.getElementById('root');
  if (root && !root.hasChildNodes()) {
    root.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
        font-family: system-ui, sans-serif;
        padding: 20px;
      ">
        <div style="
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 32px;
          max-width: 400px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.2);
        ">
          <div style="font-size: 48px; margin-bottom: 16px;">😔</div>
          <h2 style="color: white; font-size: 24px; margin-bottom: 8px;">Something went wrong</h2>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 24px;">
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button 
            onclick="window.location.reload()"
            style="
              background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 12px;
              font-weight: 600;
              cursor: pointer;
              font-size: 16px;
            "
          >
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
  
  return true;
};

window.onunhandledrejection = function(event) {
  console.error('Unhandled promise rejection:', event.reason);
};

try {
  const container = document.getElementById('root');
  
  if (!container) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to mount app:', error);
}
