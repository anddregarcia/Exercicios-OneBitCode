import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import CountryForm from "../components/forms/CountryForm";

export default function CountryPage() {
  const [form, setForm] = useState({ name: "", code: "" });
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/country", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", code: "" });
  };

  return (
    <FormContainer title="Cadastro de País">
      <CountryForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}