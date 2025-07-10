import { useState, useEffect } from 'react';
import MarketForm from '../components/forms/MarketForm';

export default function MarketPage() {
  const [form, setForm] = useState({ code: '', name: '', address: '' });
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/address')
      .then(res => res.json())
      .then(data => setAddresses(data))
      .catch(() => setAddresses([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert('Mercado cadastrado com sucesso');
      setForm({ code: '', name: '', address: '' });
    } else {
      alert('Erro ao cadastrar mercado');
    }
  };

  return (
    <div>
      <h1>Cadastro de Mercado</h1>
      <MarketForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        showCode={true}
        showAddress={true}
        addresses={addresses}
      />
    </div>
  );
}