import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';    // ← Point d'entrée du design system
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
