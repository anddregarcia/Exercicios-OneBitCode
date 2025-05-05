import { useState } from 'react';

export default function CountryForm() {
    const [form, setForm] = useState({
        code: '',
        name: ''
      });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(`http://localhost:3001/api/country`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });
      
          const data = await res.json().catch(() => ({}));
          
          if (res.ok) {
            alert('País cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
          } else {
            alert('Erro ao cadastrar: ' + res.status);
          }
        } catch (err) {
          alert('Erro de rede');
        }
      };
    
    return (
        <div>
          <h1>Cadastro de País</h1>
          <form onSubmit={handleSubmit}>
            <input name="code" placeholder="Código" onChange={handleChange} />
            <input name="name" placeholder="Nome" onChange={handleChange} />
            <button type="submit">Cadastrar</button>
          </form>
        </div>
      );
  }
