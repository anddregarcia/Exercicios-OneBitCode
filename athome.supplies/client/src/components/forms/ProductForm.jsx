import { useEffect, useState } from "react";

export default function ProductForm({ form, setForm, onSubmit }) {

  const [brands, setBrands] = useState([]);
  const [unitsMeasurement, setUnitsMeasurement] = useState([]);
  const [items, setItems] = useState([]);

  /*
  code: '',
      name: '',
      brand: '',
      volume: 0.0,
      unitMeasurement: '',
      item: '',
      isVegan: false*/

  useEffect(() => {
    fetch('http://localhost:3001/api/brand')
      .then(res => res.json())
      .then(data => setBrands(data))
      .catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/unitMeasurement')
      .then(res => res.json())
      .then(data => setUnitsMeasurement(data))
      .catch(() => setUnitsMeasurement([]));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/item')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(() => setItems([]));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, 
      [name]: type === "checkbox" ? checked : value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      <input
        name="name"
        placeholder="Nome do Produto"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="code"
        placeholder="Código"
        value={form.code}
        onChange={handleChange}
      />

      <label>
        <input name="isVegan" type="checkbox" placeholder="Produto Vegano" onChange={handleChange} />
        Produto vegano
      </label>
        
      <input type="number" name="volume" placeholder="Volume" step="0.10" onChange={handleChange} />

      <select name="unitMeasurement" onChange={handleChange}>
        <option value="">Selecione a Unidade de Medida</option>
        {unitsMeasurement.map(unitMeasurement => (
          <option key={unitMeasurement._id} value={unitMeasurement._id}>
            {unitMeasurement.code}
          </option>
        ))}
      </select>
      
      <select name="brand" onChange={handleChange}>
        <option value="">Selecione a Marca</option>
        {brands.map(brand => (
          <option key={brand._id} value={brand._id}>
            {brand.name}
          </option>
        ))}
      </select>

      <select name="item" onChange={handleChange}>
        <option value="">Selecione o Item</option>
        {items.map(item => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}

/*

import { useState, useEffect } from 'react';

export default function ProductForm() {
  const [form, setForm] = useState({
      code: '',
      name: '',
      brand: '',
      volume: 0.0,
      unitMeasurement: '',
      item: '',
      isVegan: false
    });

  const [brands, setBrand] = useState([]);
  const [items, setItem] = useState([]);
  const [unitMeasurements, setUnitMeasurement] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/brand')
      .then(res => res.json())
      .then(data => setBrand(data))
      .catch(() => setBrand([]));
    }, []);

  useEffect(() => {
      fetch('http://localhost:3001/api/item')
      .then(res => res.json())
      .then(data => setItem(data))
      .catch(() => setItem([]));
    }, []);
  
    useEffect(() => {
      fetch('http://localhost:3001/api/unitMeasurement')
      .then(res => res.json())
      .then(data => setUnitMeasurement(data))
      .catch(() => setUnitMeasurement([]));
    }, []);

    const handleChange = (e) => {
      const { name, type, value, checked } = e.target;
      setForm({ ...form, 
        [name]: type === "checkbox" ? checked : value });
    };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/product`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Produto cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Produto</h1>
        <form onSubmit={handleSubmit}>
          <input name="code" placeholder="Código" onChange={handleChange} />
          <input name="name" placeholder="Nome" onChange={handleChange} />
          <input type="number" name="volume" placeholder="Volume" step="0.01" onChange={handleChange} />

          <select name="brand" onChange={handleChange}>
            <option value="">Selecione uma marca</option>
            {brands.map(brand => (
              <option key={brand._id} value={brand._id}>
                {brand.code} - {brand.name}
              </option>
            ))}
          </select>

          <select name="item" onChange={handleChange}>
            <option value="">Selecione um item</option>
            {items.map(item => (
              <option key={item._id} value={item._id}>
                {item.code} - {item.name}
              </option>
            ))}
          </select>

          <select name="unitMeasurement" onChange={handleChange}>
            <option value="">Selecione uma unidade de medida</option>
            {unitMeasurements.map(unitMeasurement => (
              <option key={unitMeasurement._id} value={unitMeasurement._id}>
                {unitMeasurement.code} - {unitMeasurement.name}
              </option>
            ))}
          </select>

          <label>
            <input name="isVegan" type="checkbox" placeholder="Produto Vegano" onChange={handleChange} />
            Produto vegano
          </label>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
*/