import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import DeletePopup from "../components/DeletePopup/DeletePopup";
import "./ReadItems.css";
import type { Item } from "../interfaces";

const ReadItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const perPage = 6;

  const defaultImage =
    "https://via.placeholder.com/300x200?text=No+Image&bg=E8E8E8&textColor=999";

  const getItems = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "https://dashboard-i552.onrender.com/api/items",
        {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Items loaded:", res.data);
      setItems(res.data.data || res.data || []);
      setLoading(false);
    } catch (error: any) {
      console.error("❌ Error fetching items:", error);
      setError("Failed to load products");
      setLoading(false);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const deleteItem = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://dashboard-i552.onrender.com/api/items/${id}`,
        {
          headers: {
            Authorization: token || "",
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Product deleted");
      setPopup(false);
      getItems();
    } catch (error) {
      console.error("❌ Delete Error:", error);
      alert("Failed to delete item");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filteredItems.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="page">
      <Sidebar />

      <div className="container">
        {/* top bar */}
        <div className="topbar">
          <input
            placeholder="🔍 Search product by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link to="/dashboard/add">
            <button className="add-btn">➕ ADD NEW PRODUCT</button>
          </Link>
        </div>

        {/* error message */}
        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px",
              borderRadius: "4px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* grid */}
        <div className="grid">
          {loading ? (
            <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
              <p>⏳ Loading products...</p>
            </div>
          ) : items.length === 0 ? (
            <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
              <p>📦 No products found</p>
              <p>Create your first product by clicking "ADD NEW PRODUCT"</p>
            </div>
          ) : paginated.length > 0 ? (
            paginated.map((item) => (
              <div className="card" key={item.id}>
                {/* actions */}
                <div className="card-actions">
                  <Link to={`/dashboard/edit/${item.id}`}>
                    <button className="edit-btn">✏️ Edit</button>
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => {
                      setSelected(item.id);
                      setPopup(true);
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* show page */}
                <Link to={`/dashboard/show/${item.id}`}>
                  <img
                    src={
                      item.image_url && item.image_url.trim() !== ""
                        ? item.image_url
                        : defaultImage
                    }
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                </Link>

                <h3>{item.name}</h3>
                <p className="price">${item.price}</p>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", width: "100%", padding: "40px" }}>
              <p>🔍 No products match your search</p>
            </div>
          )}
        </div>

        {/* pagination */}
        {paginated.length > 0 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </button>

            <span>Page {page}</span>

            <button
              disabled={page * perPage >= filteredItems.length}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </button>
          </div>
        )}

        {/* popup */}
        {popup && (
          <DeletePopup
            onConfirm={() => selected && deleteItem(selected)}
            onCancel={() => setPopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ReadItems;