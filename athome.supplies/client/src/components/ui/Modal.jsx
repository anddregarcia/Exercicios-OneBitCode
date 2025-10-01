import '../../styles/modal.css';

export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {title && <h3>{title}</h3>}
        {children}
        <button className="modal-close" onClick={onClose}>x</button>
      </div>
    </div>
  );
}