// src/components/MarketModal.jsx
import { useState } from 'react';
import MarketForm from '../forms/MarketForm';

export default function MarketModal({ isOpen, onClose, onMarketCreated, addresses }) {
  const [form, setForm] = useState({ code: '', name: '', address: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/market', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: form.name, name: form.name }) // só os campos usados!
    });

    if (res.ok) {
      const data = await res.json();
      onMarketCreated(data);
      setForm({ code: '', name: '', address: '' });
      onClose();
    } else {
      alert('Erro ao cadastrar mercado');
    }
  };

  return (
    <div style={modalStyle.overlay}>
      <div style={modalStyle.modal}>
        <h3>Cadastrar Novo Mercado</h3>
        <MarketForm
            form={form}
            setForm={setForm}
            onSubmit={handleSubmit}
            showCode={false}
            showAddress={false}
            addresses={addresses}
        />
        <div style={modalStyle.modal}>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cancelButton: {
    background: '#eee',
    border: 'none',
    padding: '6px 12px',
    cursor: 'pointer'
  }
};