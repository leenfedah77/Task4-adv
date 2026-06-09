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
        
        <h5>Are you sure you want to delete the product?</h5>
        

        <div className="popup-buttons">
          <button
            className="popup-btn popup-yes"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? " Deleting..." : " YES"}
          </button>

          <button
            className="popup-btn popup-no"
            onClick={onCancel}
            disabled={loading}
          >
             NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;