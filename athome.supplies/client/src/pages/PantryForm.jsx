import { useState } from 'react';

export default function PantryForm() {
  const [form, setForm] = useState({
      code: '',
      description: ''
    });

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/pantry`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Prateleira cadastrada com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Prateleira</h1>
        <form onSubmit={handleSubmit}>
          <input name="code" placeholder="Código" onChange={handleChange} />
          <input name="description" placeholder="Descrição" onChange={handleChange} />

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
