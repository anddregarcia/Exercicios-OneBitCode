import { useState, useEffect } from 'react';

export default function ItemForm() {
  const [form, setForm] = useState({
      code: '',
      name: '',
      category: ''
    });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/category')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const res = await fetch(`http://localhost:3001/api/item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
    
        const data = await res.json().catch(() => ({}));
        
        if (res.ok) {
          alert('Item cadastrado com sucesso:\n' + JSON.stringify(data, null, 2));
        } else {
          alert('Erro ao cadastrar: ' + res.status);
        }
      } catch (err) {
        alert('Erro de rede');
      }
    };
  
  return (
      <div>
        <h1>Cadastro de Item</h1>
        <form onSubmit={handleSubmit}>
          <input name="code" placeholder="Código" onChange={handleChange} />
          <input name="name" placeholder="Nome" onChange={handleChange} />

          <select name="category" onChange={handleChange}>
            <option value="">Selecione uma categoria</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.code} - {category.name}
              </option>
            ))}
          </select>

          <button type="submit">Cadastrar</button>
        </form>
      </div>
    );
}
