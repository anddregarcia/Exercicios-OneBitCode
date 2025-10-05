import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityPage from './pages/CityPage';
import StatePage from './pages/StatePage';
import CountryPage from './pages/CountryPage';
import AddressPage from './pages/AddressPage';
import MarketPage from './pages/MarketPage';
import BrandForm from './components/forms/BrandForm';
import UnitMeasurementForm from './components/forms/UnitMeasurementForm';
import CategoryForm from './components/forms/CategoryForm';
import ItemForm from './components/forms/ItemForm';
import ProductPage from './pages/ProductPage';
import ShopForm from './components/forms/ShopForm';
import ShoppingPage from './pages/ShoppingPage';
import ProductPriceForm from './components/forms/ProductPriceForm';
import PantryForm from './components/forms/PantryForm';
import PantryProductForm from './components/forms/PantryProductForm';
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
        <Route path="/Brand" element={<BrandForm />} />
        <Route path="/UnitMeasurement" element={<UnitMeasurementForm />} />
        <Route path="/Category" element={<CategoryForm />} />
        <Route path="/Item" element={<ItemForm />} />
        <Route path="/Product" element={<ProductPage />} />
        <Route path="/Shop" element={<ShopForm />} />
        <Route path="/Shopping" element={<ShoppingPage />} />
        <Route path="/ProductPrice" element={<ProductPriceForm />} />
        <Route path="/Pantry" element={<PantryForm />} />
        <Route path="/PantryProduct" element={<PantryProductForm />} />
      </Routes>
    </Router>
  );
}

export default App;
