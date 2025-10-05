import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import CategoryForm from "../components/forms/CategoryForm";

export default function CategoryPage() {
  const [form, setForm] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "" });
  };

  return (
    <FormContainer title="Cadastro de Categoria de Produto">
      <CategoryForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}