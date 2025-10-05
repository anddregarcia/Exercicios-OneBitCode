import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import BrandForm from "../components/forms/BrandForm";

export default function BrandPage() {
  const [form, setForm] = useState({ code: "", name: "", isVegan: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/brand", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "", isVegan: "" });
  };

  return (
    <FormContainer title="Cadastro de Marcas">
      <BrandForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}