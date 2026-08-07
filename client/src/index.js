import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { EquipmentProvider } from './context/EquipmentContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <EquipmentProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </EquipmentProvider>
    </AuthProvider>
  </React.StrictMode>
);
