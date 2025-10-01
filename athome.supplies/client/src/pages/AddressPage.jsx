import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import AddressForm from "../components/forms/AddressForm";

export default function AddressPage() {
  const [form, setForm] = useState({ street: "", number: "", neighborhood: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/address", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ street: "", number: "", neighborhood: "" });
  };

  return (
    <FormContainer title="Cadastro de Endereço">
      <AddressForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}