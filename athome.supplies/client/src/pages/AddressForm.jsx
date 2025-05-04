import { useState } from 'react';
import axios from 'axios';

export default function AddressForm() {
    const [form, setForm] = useState({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        country: ''
      });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await fetch(`http://localhost:3001/api/address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
          });
      
          const data = await res.json().catch(() => ({}));
          
          if (res.ok) {
            alert('Endereço cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
          } else {
            alert('Erro ao cadastrar: ' + res.status);
          }
        } catch (err) {
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
            <input name="state" placeholder="Estado" onChange={handleChange} />
            <input name="country" placeholder="País" onChange={handleChange} />
            <button type="submit">Cadastrar</button>
          </form>
        </div>
      );
  }
