import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const PORT = process.env.PORT || 3001

function App() {
  const [form, setForm] = useState({
    street: '',
    number: '',
    neighborhood: '',
    city: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:${PORT}/api/address`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
  
      console.log('Status:', res.status);
      const data = await res.json().catch(() => ({}));
      console.log('Resposta:', data);
  
      if (res.ok) {
        alert('Endereço cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
      } else {
        alert('Erro ao cadastrar: ' + res.status);
      }
    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('Erro de rede');
    }
  };

  return (
    <div>
      <h1>Cadastro de Endereço</h1>
      <form onSubmit={handleSubmit}>
        <input name="street" placeholder="Rua" onChange={handleChange} />
        <input name="number" placeholder="Número" onChange={handleChange} />
        <input name="neighborhood" placeholder="Bairro" onChange={handleChange} />
        <input name="city" placeholder="Cidade" onChange={handleChange} />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  )
}

export default App
