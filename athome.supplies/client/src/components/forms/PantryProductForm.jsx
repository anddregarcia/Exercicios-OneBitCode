import { useEffect, useState } from "react";

export default function PantryProductForm({ form, setForm, onSubmit }) {

  const [products, setProduct] = useState([]);
  const [pantries, setPantry] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/product')
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct([]));
  }, []);

  useEffect(() => {
    fetch('http://localhost:3001/api/pantry')
      .then(res => res.json())
      .then(data => setPantry(data))
      .catch(() => setPantry([]));
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm({ ...form, 
      [name]: type === "checkbox" ? checked : value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      
      <select name="pantry" onChange={handleChange}>
        <option value="">Selecione uma prateleira</option>
        {pantries.map(pantry => (
          <option key={pantry._id} value={pantry._id}>
            {pantry.code}
          </option>
        ))}
      </select>
      
      <select name="product" onChange={handleChange}>
        <option value="">Selecione um produto</option>
        {products.map(product => (
          <option key={product._id} value={product._id}>
            {product.code} - {product.name}
          </option>
        ))}
      </select>

      <input type="number" name="quantity" placeholder="Quantidade" step="0.01" onChange={handleChange} />
    
      <label>
        <input name="mustHave" type="checkbox" onChange={handleChange} />
        Não deixe faltar
      </label>
      
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}