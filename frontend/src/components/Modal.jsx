import "./Modal.css";

function Modal({ isOpen, title, onCloseRequested, children }) {
  if (!isOpen) return null;

  function closeIfClickedOutside(event) {
    if (event.target === event.currentTarget) {
      onCloseRequested();
    }
  }

  return (
    <div className="modal-backdrop" onClick={closeIfClickedOutside}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close-button"
            aria-label="Close"
            onClick={onCloseRequested}
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
