export default function BrandForm({ form, setForm, onSubmit }) {

  const handleChange = (e) => {
      const { name, type, value, checked } = e.target;
      setForm({ ...form, 
        [name]: type === "checkbox" ? checked : value });
  };

  return (
    <form onSubmit={onSubmit} className="basic-form">
      <input
        name="name"
        placeholder="Nome da Marca"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="code"
        placeholder="Código"
        value={form.code}
        onChange={handleChange}
      />
      <label>
        <input name="isVegan" type="checkbox" placeholder="Marca Vegana" onChange={handleChange} />
        Marca vegana
      </label>
      <div className="actions">
        <button type="submit" className="btn btn-primary">
          Salvar
        </button>
      </div>

    </form>
  );
}