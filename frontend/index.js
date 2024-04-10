import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/reset.css';
import './styles/styles.css';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <Router>
    <App />
  </Router>
);