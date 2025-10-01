import { useState, useEffect } from 'react';

export default function ProductForm() {
  const [form, setForm] = useState({
      product: '',
      shop: '',
      value: 0.0,
      quantity: 0.0,
      date: '',
    });

  const [products, setProduct] = useState([]);
  const [shops, setShop] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/product')
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(() => setProduct([]));
    }, []);

  useEffect(() => {
      fetch('http://localhost:3001/api/shop')
      .then(res => res.json())
      .then(data => setShop(data))
      .catch(() => setShop([]));
    }, []);

  const handleChange = (e) => {
      //setForm({ ...form, [e.target.name]: e.target.value });

      const { name, value } = e.target;

      if (name === "shop") {
        const selectedShop = shops.find(shop => shop._id === value);
        setForm(prevForm => ({
          ...prevForm,
          shop: value,
          date: selectedShop ? selectedShop.date.slice(0, 10) : ''  // yyyy-mm-dd
        }));
      } else {
        setForm(prevForm => ({
          ...prevForm,
          [name]: value
        }));
      }
    };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/productPrice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Preço de produto cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Preço de Produto</h1>
        <form onSubmit={handleSubmit}>

          <select name="shop" onChange={handleChange}>
            <option value="">Selecione uma compra</option>
            {shops.map(shop => (
              <option key={shop._id} value={shop._id}>
                {shop.market.name} - {shop.date.slice(0, 10).split('-').reverse().join('/')}
              </option>
            ))}
          </select>
          
          <label>Data:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <select name="product" onChange={handleChange}>
            <option value="">Selecione um produto</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.code} - {product.name}
              </option>
            ))}
          </select>
          
          <input type="number" name="value" placeholder="Valor" step="0.01" onChange={handleChange} />

          <input type="number" name="quantity" placeholder="Quantidade" step="0.01" onChange={handleChange} />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
