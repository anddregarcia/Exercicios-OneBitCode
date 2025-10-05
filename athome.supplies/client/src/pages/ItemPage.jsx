import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import ItemForm from "../components/forms/ItemForm";

export default function ItemPage() {
  const [form, setForm] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "" });
  };

  return (
    <FormContainer title="Cadastro de Item">
      <ItemForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}