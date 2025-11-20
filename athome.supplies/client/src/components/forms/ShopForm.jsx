import { useEffect, useState } from "react";

export default function ShopForm({ form, setForm, onSubmit }) {

  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/market')
      .then(res => res.json())
      .then(data => setMarkets(data))
      .catch(() => setMarkets([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
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
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>

    </form>
  );
}