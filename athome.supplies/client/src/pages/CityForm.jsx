import { useState, useEffect } from 'react';

export default function CityForm() {
  const [form, setForm] = useState({
      code: '',
      name: '',
      state: ''
    });

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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3001/api/city`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
  
      const data = await res.json().catch(() => ({}));
      
      if (res.ok) {
        alert('Cidade cadastrada com sucesso:\n' + JSON.stringify(data, null, 2));
      } else {
        alert('Erro ao cadastrar: ' + res.status);
      }
    } catch (err) {
      alert('Erro de rede');
    }
  };
  
  return (
      <div>
        <h1>Cadastro de Cidade</h1>
        <form onSubmit={handleSubmit}>
          <input name="code" placeholder="Código" onChange={handleChange} />
          <input name="name" placeholder="Nome" onChange={handleChange} />

          <select name="state" onChange={handleChange}>
            <option value="">Selecione um estado</option>
            {states.map(state => (
              <option key={state._id} value={state._id}>
                {state.code} - {state.name}
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
