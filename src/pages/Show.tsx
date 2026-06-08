import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Show.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Item } from "../interfaces";

const Show = () => {
  const [item, setItem] = useState<Item>();
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getItem = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://dashboard-i552.onrender.com/api/items/${id}`,
          {
            headers: {
              Authorization:
                localStorage.getItem("token") || "",
              Accept: "application/json",
            },
          }
        );

        setItem(response.data.data);
        setLoading(false);
      } catch (err) {
        console.log("Error fetching item:", err);
        setLoading(false);
      }
    };

    if (id) getItem();
  }, [id]);

  return (
    <div className="showpage">
      <Sidebar />

      <div className="showcontainer">
        <div
          className="back"
          onClick={() => navigate("/dashboard")}
          title="Go back"
        >
          ←
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#999" }}>⏳ Loading product details...</p>
        ) : item ? (
          <>
            <h1 className="title">{item?.name}</h1>

            <div className="imageBox">
              <img
                src={
                  item?.image_url ||
                  "https://via.placeholder.com/400x300?text=No+Image&bg=E8E8E8&textColor=999"
                }
                alt={item?.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x300?text=No+Image";
                }}
              />
            </div>

            <div className="info">
              <h2>
                💰 Price:
                <span>${item?.price}</span>
              </h2>

              <h2>
                📅 Added At:
                <span>
                  {"created_at" in (item || {})
                    ? new Date(item?.created_at!).toLocaleDateString()
                    : "-----"}
                </span>
              </h2>
            </div>

            <div className="updated">
              <h2>
                ✏️ Updated At:
                <span>
                  {"updated_at" in (item || {})
                    ? new Date(item?.updated_at!).toLocaleDateString()
                    : "-----"}
                </span>
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <Link to={`/dashboard/edit/${item.id}`}>
                <button className="edit-action-btn">✏️ EDIT</button>
              </Link>
              <button
                className="back-action-btn"
                onClick={() => navigate("/dashboard")}
              >
                ← BACK
              </button>
            </div>
          </>
        ) : (
          <p>❌ Product not found</p>
        )}
      </div>
    </div>
  );
};

export default Show;