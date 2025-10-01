export default function CountryForm({ form, setForm, onSubmit }) {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      <input
        name="name"
        placeholder="Nome do país"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="code"
        placeholder="Código"
        value={form.code}
        onChange={handleChange}
      />
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>
    </form>
  );
}