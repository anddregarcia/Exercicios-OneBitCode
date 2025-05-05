import { useState, useEffect } from 'react';

export default function MarketForm() {
  const [form, setForm] = useState({
    code: '',
    name: '',
    address: ''
  });

  const [addresses, setAddresses] = useState([]);

  // Busca os endereços cadastrados para exibir no select
  useEffect(() => {
    fetch('http://localhost:3001/api/address')
      .then(res => res.json())
      .then(data => setAddresses(data))
      .catch(() => setAddresses([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert('Mercado cadastrado:\n' + JSON.stringify(data, null, 2));
      } else {
        alert('Erro ao cadastrar: ' + res.status);
      }
    } catch (err) {
      alert('Erro de rede');
    }
  };

  return (
    <div>
      <h1>Cadastro de Mercado</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome do mercado" onChange={handleChange} />
        <input name="code" placeholder="Código" onChange={handleChange} />

        <select name="address" onChange={handleChange}>
          <option value="">Selecione um endereço</option>
          {addresses.map(addr => (
            <option key={addr._id} value={addr._id}>
              {addr.street}, {addr.number} - {addr.city}
            </option>
          ))}
        </select>

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}
