import { useEffect, useState } from "react";

export default function MarketForm({ form, setForm, onSubmit, showAddress = true }) {

  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/address')
      .then(res => res.json())
      .then(data => setAddresses(data))
      .catch(() => setAddresses([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      <input
        name="name"
        placeholder="Nome do mercado"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="code"
        placeholder="Código"
        value={form.code}
        onChange={handleChange}
      />
      
      {showAddress && 
      <select name="address" onChange={handleChange}>
        <option value="">Selecione o endereço</option>
        {addresses.map(address => (
          <option key={address._id} value={address._id}>
            {address.street}
          </option>
        ))}
      </select>}
      
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}