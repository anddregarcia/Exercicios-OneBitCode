import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import ProductPriceForm from "../components/forms/ProductPriceForm";

export default function ProductPricePage() {
  const [form, setForm] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/productPrice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "" });
  };

  return (
    <FormContainer title="Cadastro de Preço de Produto">
      <ProductPriceForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}