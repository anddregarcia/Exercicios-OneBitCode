import { useEffect, useState } from 'react';

export default function ShopForm() {
  const [markets, setMarkets] = useState([]);
  const [form, setForm] = useState({
    market: '',
    date: ''
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/market')
      .then(res => res.json())
      .then(data => setMarkets(data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/shop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (res.ok) {
      alert('Compra cadastrada com sucesso:\n' + JSON.stringify(data, null, 2));
      setForm({ market: '', date: '' });
    } else {
      alert('Erro ao cadastrar compra');
      console.error(data);
    }
  };

  return (
    <div>
      <h2>Cadastrar Compra</h2>
      <form onSubmit={handleSubmit}>
        <label>Mercado:</label>
        <select name="market" value={form.market} onChange={handleChange} required>
          <option value="">Selecione</option>
          {markets.map(market => (
            <option key={market._id} value={market._id}>{market.name}</option>
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
        <button type="submit">Cadastrar Compra</button>
      </form>
    </div>
  );
}
