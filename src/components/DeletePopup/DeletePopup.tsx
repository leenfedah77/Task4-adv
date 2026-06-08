import "./DeletePopup.css";

interface DeletePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeletePopup = ({ onConfirm, onCancel }: DeletePopupProps) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>🗑️ DELETE PRODUCT?</h3>
        <p>Are you sure you want to delete this product?</p>
        <p style={{ fontSize: "12px", color: "#999" }}>
          This action cannot be undone.
        </p>

        <div className="popup-buttons">
          <button className="popup-btn popup-yes" onClick={onConfirm}>
            ✅ YES
          </button>

          <button className="popup-btn popup-no" onClick={onCancel}>
            ❌ NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;