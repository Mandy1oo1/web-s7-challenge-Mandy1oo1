import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './Home';
import Form from './Form';

function App({ useRouter }) {
  const RouterComponent = useRouter ? Router : React.Fragment;

  return (
    <RouterComponent>
      <div id="app">
        <nav>
          <NavLink to="/" data-testid="home-link">Home</NavLink>
          <NavLink to="/order" data-testid="order-link">Order</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<Form />} />
        </Routes>
      </div>
    </RouterComponent>
  );
}

export default App;
