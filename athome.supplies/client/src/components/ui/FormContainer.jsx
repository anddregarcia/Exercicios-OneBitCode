export default function FormContainer({ title, children }) {
  return (
    <div className="form-container">
      {title && <h1>{title}</h1>}
      {children}
    </div>
  );
}