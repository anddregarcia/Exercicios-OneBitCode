import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import CityForm from "../components/forms/CityForm";

export default function CityPage() {
  const [form, setForm] = useState({ name: "", code: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/city", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", code: "" });
  };

  return (
    <FormContainer title="Cadastro de Cidade">
      <CityForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}