import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import ShopForm from "../components/forms/ShopForm";

export default function ShopPage() {
  const [form, setForm] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/shop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "" });
  };

  return (
    <FormContainer title="Cadastro de Compra">
      <ShopForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}