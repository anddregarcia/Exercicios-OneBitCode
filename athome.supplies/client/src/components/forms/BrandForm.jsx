import { useState } from 'react';

export default function BrandForm() {
  const [form, setForm] = useState({
      code: '',
      name: '',
      isVegan: false
    });

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/brand`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Marca cadastrada com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Marca</h1>
        <form onSubmit={handleSubmit}>
          <input name="code" placeholder="Código" onChange={handleChange} />
          <input name="name" placeholder="Nome" onChange={handleChange} />
          <label>
            <input name="isVegan" type="checkbox" placeholder="Marca Vegana" onChange={handleChange} />
            Marca vegana
          </label>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
