import { useState } from "react";
import FormContainer from "../components/ui/FormContainer";
import UnitMeasurementForm from "../components/forms/UnitMeasurementForm";

export default function UnitMeasurementPage() {
  const [form, setForm] = useState({ code: "", name: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/api/unitMeasurement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ code: "", name: "" });
  };

  return (
    <FormContainer title="Cadastro de Unidade de Medida">
      <UnitMeasurementForm form={form} setForm={setForm} onSubmit={handleSubmit} />
    </FormContainer>
  );
}