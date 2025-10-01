import { useEffect, useState } from "react";

export default function CityForm({ form, setForm, onSubmit }) {
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/state')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(() => setStates([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      <input
        name="name"
        placeholder="Nome da Cidade"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="code"
        placeholder="Código"
        value={form.code}
        onChange={handleChange}
      />
      <select name="state" onChange={handleChange}>
        <option value="">Selecione um estado</option>
        {states.map(state => (
          <option key={state._id} value={state._id}>
            {state.code} - {state.name}
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