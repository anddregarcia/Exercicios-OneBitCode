import { useEffect } from 'react';

export default function MarketForm ({ form, setForm, onSubmit, showCode, showAddress, addresses })
{
  useEffect(() => {
    if (showAddress && addresses.length === 0) {
      fetch('http://localhost:3001/api/address')
        .then(res => res.json())
        .then(data => setForm(f => ({ ...f, addresses: data })))
        .catch(() => {});
    }
  }, [showAddress, addresses, setForm]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.form}>
      <form onSubmit={onSubmit}>
        <div style={styles.row}>
          <input
            name="name"
            placeholder="Nome do mercado"
            value={form.name}
            onChange={handleChange}
          />
          {showCode && (
          <input
            name="code"
            placeholder="Código"
            value={form.code}
            onChange={handleChange}
          />
          )}
        
          {showAddress && (
            <select name="address" value={form.address} onChange={handleChange}>
              <option value="">Selecione um endereço</option>
              {addresses.map(addr => (
                <option key={addr._id} value={addr._id}>
                  {addr.street}, {addr.number} - {addr.city}
                </option>
              ))}
            </select>
          )}
        </div>

        <div style={styles.saveButton}>
          <button type="submit">Salvar</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  saveButton: {
    background: '#eee',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer'
  }
};