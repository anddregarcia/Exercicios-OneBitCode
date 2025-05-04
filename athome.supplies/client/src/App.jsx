import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddressForm from './pages/AddressForm';
import MarketForm from './pages/MarketForm';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

//const PORT = process.env.PORT || 3001

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Address" element={<AddressForm />} />
        <Route path="/Market" element={<MarketForm />} />
      </Routes>
    </Router>
  );
}

export default App;
