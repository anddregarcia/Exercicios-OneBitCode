import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import StateForm from "../components/forms/StateForm";

export default function StatePage() {
  const [form, setForm] = useState({ name: "", code: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", code: "" });
  };

  return (
    <FormContainer title="Cadastro de Estado">
      <StateForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}