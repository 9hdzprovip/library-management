import './Modal.css';

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        aria-label={title}
        aria-modal="true"
        className="modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <h2>{title}</h2>
          <button className="modal__close" aria-label="Close modal" type="button" onClick={onClose}>
            &times;
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </section>
    </div>
  );
}

export default Modal;
