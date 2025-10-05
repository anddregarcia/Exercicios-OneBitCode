import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import PantryForm from "../components/forms/PantryForm";

export default function PantryPage() {
  const [form, setForm] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/pantry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "" });
  };

  return (
    <FormContainer title="Cadastro de Despensa">
      <PantryForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}