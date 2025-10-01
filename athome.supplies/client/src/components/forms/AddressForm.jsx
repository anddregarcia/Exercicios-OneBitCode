import { useEffect, useState } from "react";

export default function AddressForm({ form, setForm, onSubmit }) {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/city')
      .then(res => res.json())
      .then(data => setCities(data))
      .catch(() => setCities([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">   
      <input name="street" placeholder="Rua" value={form.street} onChange={handleChange} />
      <input name="number" placeholder="Número" value={form.number} onChange={handleChange} />
      <input name="neighborhood" placeholder="Bairro" value={form.neighborhood} onChange={handleChange} />

      <select name="city" onChange={handleChange}>
        <option value="">Selecione a cidade</option>
        {cities.map(city => (
          <option key={city._id} value={city._id}>
            {city.code} - {city.name}
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