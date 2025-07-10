import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CityForm from './pages/CityForm';
import StateForm from './pages/StateForm';
import CountryForm from './pages/CountryForm';
import AddressForm from './pages/AddressForm';
import MarketPage from './pages/MarketPage';
import BrandForm from './pages/BrandForm';
import UnitMeasurementForm from './pages/UnitMeasurementForm';
import CategoryForm from './pages/CategoryForm';
import ItemForm from './pages/ItemForm';
import ProductForm from './pages/ProductForm';
import ShopForm from './pages/ShopForm';
import ShoppingPage from './pages/ShoppingPage';
import ProductPriceForm from './pages/ProductPriceForm';
import PantryForm from './pages/PantryForm';
import PantryProductForm from './pages/PantryProductForm';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

//const PORT = process.env.PORT || 3001

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/City" element={<CityForm />} />
        <Route path="/State" element={<StateForm />} />
        <Route path="/Country" element={<CountryForm />} />
        <Route path="/Address" element={<AddressForm />} />
        <Route path="/Market" element={<MarketPage />} />
        <Route path="/Brand" element={<BrandForm />} />
        <Route path="/UnitMeasurement" element={<UnitMeasurementForm />} />
        <Route path="/Category" element={<CategoryForm />} />
        <Route path="/Item" element={<ItemForm />} />
        <Route path="/Product" element={<ProductForm />} />
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
