import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import ProductForm from "../forms/ProductForm";
import Button from "../ui/Button";

export default function ProductModal({ isOpen, onClose, onProductCreated }) {
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
	
    const res = await fetch("http://localhost:3001/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      onProductCreated(data);
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
        <Modal title="Cadastrar Novo Produto" onClose={onClose}>
          <ProductForm form={form} setForm={setForm} onSubmit={handleSubmit} />
        </Modal>
      </div>
    </div>
  );
}