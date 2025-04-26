import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';  // Explicitly import with .js extension

const rootElement = document.getElementById('root');

if (!rootElement) {
  const errorDiv = document.createElement('div');
  errorDiv.style.color = 'red';
  errorDiv.style.padding = '20px';
  errorDiv.textContent = 'Error: Could not find root element. Make sure there is a <div id="root"></div> in your HTML.';
  document.body.appendChild(errorDiv);
} else {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
