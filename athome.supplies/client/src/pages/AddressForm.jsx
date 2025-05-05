import { useState, useEffect } from 'react';

export default function AddressForm() {
    const [form, setForm] = useState({
        street: '',
        number: '',
        neighborhood: '',
        city: ''
      });

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
            
            <select name="city" onChange={handleChange}>
              <option value="">Selecione um cidade</option>
              {cities.map(city => (
                <option key={city._id} value={city._id}>
                  {city.code} - {city.name}
                </option>
              ))}
            </select>

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      );
  }
