import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import MarketForm from "../forms/MarketForm";
import Button from "../ui/Button";

export default function MarketModal({ isOpen, onClose, onMarketCreated }) {
  const [form, setForm] = useState({ name: "", code: "" });

  // ESC fecha o modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/market", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      onMarketCreated(data);
      setForm({ name: "", code: "" });
      onClose();
    }
  };

  // clique fora do modal fecha também
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <Modal title="Cadastrar Novo Mercado" onClose={onClose}>
          <MarketForm form={form} setForm={setForm} onSubmit={handleSubmit} />
        </Modal>
      </div>
    </div>
  );
}