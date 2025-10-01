import { useEffect, useState } from "react";

export default function StateForm({ form, setForm, onSubmit }) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/country')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(() => setCountries([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      <input
        name="name"
        placeholder="Nome do Estado"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="code"
        placeholder="Código"
        value={form.code}
        onChange={handleChange}
      />
      <select name="country" onChange={handleChange}>
        <option value="">Selecione um país</option>
        {countries.map(country => (
          <option key={country._id} value={country._id}>
            {country.code} - {country.name}
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