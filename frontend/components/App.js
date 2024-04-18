import React from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'; // Import useLocation here
import Home from './Home';
import Form from './Form';

function App() {
  const location = useLocation(); // Use useLocation here

  return (
    <div id="app">
      <nav>
        <NavLink to="/" data-testid="home-link">Home</NavLink>
        <NavLink to="/order" data-testid="order-link">Order</NavLink>
      </nav>
      <Routes location={location}> {/* Pass location to Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;