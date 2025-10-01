import { useState, useEffect } from 'react';

export default function ProductForm() {
  const [form, setForm] = useState({
      product: '',
      pantry: '',
      quantity: 0.0,
      mustHave: false
    });

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
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/pantryProduct`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Produto cadastrado na prateleira com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Produto na Prateleira</h1>
        <form onSubmit={handleSubmit}>

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

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
