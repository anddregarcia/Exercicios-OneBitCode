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