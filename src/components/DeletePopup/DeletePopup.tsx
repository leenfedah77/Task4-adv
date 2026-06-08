import "./DeletePopup.css";

interface DeletePopupProps {
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const DeletePopup = ({ onConfirm, onCancel, loading = false }: DeletePopupProps) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>🗑️ DELETE PRODUCT?</h3>
        <p>Are you sure you want to delete this product?</p>
        <p className="warning-text">
          This action cannot be undone.
        </p>

        <div className="popup-buttons">
          <button
            className="popup-btn popup-yes"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "⏳ Deleting..." : "✅ YES"}
          </button>

          <button
            className="popup-btn popup-no"
            onClick={onCancel}
            disabled={loading}
          >
            ❌ NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;