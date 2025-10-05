import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityPage from './pages/CityPage';
import StatePage from './pages/StatePage';
import CountryPage from './pages/CountryPage';
import AddressPage from './pages/AddressPage';
import MarketPage from './pages/MarketPage';
import BrandPage from './pages/BrandPage';
import UnitMeasurementPage from './pages/UnitMeasurementPage';
import CategoryPage from './pages/CategoryPage';
import ItemPage from './pages/ItemPage';
import ProductPage from './pages/ProductPage';
import ShopForm from './components/forms/ShopForm';
import ShoppingPage from './pages/ShoppingPage';
import ProductPriceForm from './components/forms/ProductPriceForm';
import PantryPage from './pages/PantryPage';
import PantryProductPage from './pages/PantryProductPage';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

//const PORT = process.env.PORT || 3001

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/City" element={<CityPage />} />
        <Route path="/State" element={<StatePage />} />
        <Route path="/Country" element={<CountryPage />} />
        <Route path="/Address" element={<AddressPage />} />
        <Route path="/Market" element={<MarketPage />} />
        <Route path="/Brand" element={<BrandPage />} />
        <Route path="/UnitMeasurement" element={<UnitMeasurementPage />} />
        <Route path="/Category" element={<CategoryPage />} />
        <Route path="/Item" element={<ItemPage />} />
        <Route path="/Product" element={<ProductPage />} />
        <Route path="/Shop" element={<ShopForm />} />
        <Route path="/Shopping" element={<ShoppingPage />} />
        <Route path="/ProductPrice" element={<ProductPriceForm />} />
        <Route path="/Pantry" element={<PantryPage />} />
        <Route path="/PantryProduct" element={<PantryProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;
