import './Modal.css';

function Modal({ children, isOpen, onClose, title }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <header className="modal__header">
          <h2>{title}</h2>
          <button aria-label="Close modal" type="button" onClick={onClose}>
            x
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export default Modal;
