import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // Remove useLocation import
import Home from './Home';
import Form from './Form';

function App() {
  return (
    <div id="app">
      <nav>
        <NavLink to="/" data-testid="home-link">Home</NavLink>
        <NavLink to="/order" data-testid="order-link">Order</NavLink>
      </nav>
      <Routes> {/* Remove location prop */}
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
