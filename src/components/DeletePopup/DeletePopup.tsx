import "./DeletePopup.css";

interface DeletePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeletePopup = ({ onConfirm, onCancel }: DeletePopupProps) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>ARE YOU SURE YOU WANT TO DELETE THE PRODUCT?</h3>

        <div className="popup-buttons">
          <button className="popup-btn" onClick={onConfirm}>
            Yes
          </button>

          <button className="popup-btn" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;