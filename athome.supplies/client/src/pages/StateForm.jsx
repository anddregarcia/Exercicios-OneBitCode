import { useState, useEffect } from 'react';

export default function StateForm() {
  const [form, setForm] = useState({
      code: '',
      name: '',
      country: ''
    });

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
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/state`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Estado cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Estado</h1>
        <form onSubmit={handleSubmit}>
          <input name="code" placeholder="Código" onChange={handleChange} />
          <input name="name" placeholder="Nome" onChange={handleChange} />

          <select name="country" onChange={handleChange}>
            <option value="">Selecione um país</option>
            {countries.map(country => (
              <option key={country._id} value={country._id}>
                {country.code} - {country.name}
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
