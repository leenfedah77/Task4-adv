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
  const [deletePopup, setDeletePopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const perPage = 6;

  const defaultImage =
    "https://via.placeholder.com/300x200?text=No+Image&bg=E8E8E8&textColor=999";

  // صور افتراضية جميلة للعرض الأولي
  const placeholderProducts = [
    {
      id: -1,
      name: "Product 1",
      price: "99.99",
      image_url: "https://via.placeholder.com/300x200?text=Product+1&bg=FF6B6B&textColor=fff",
      created_at: "",
      updated_at: "",
    },
    {
      id: -2,
      name: "Product 2",
      price: "149.99",
      image_url: "https://via.placeholder.com/300x200?text=Product+2&bg=4ECDC4&textColor=fff",
      created_at: "",
      updated_at: "",
    },
    {
      id: -3,
      name: "Product 3",
      price: "199.99",
      image_url: "https://via.placeholder.com/300x200?text=Product+3&bg=45B7D1&textColor=fff",
      created_at: "",
      updated_at: "",
    },
    {
      id: -4,
      name: "Product 4",
      price: "249.99",
      image_url: "https://via.placeholder.com/300x200?text=Product+4&bg=FFA502&textColor=fff",
      created_at: "",
      updated_at: "",
    },
  ];

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
      setDeleteLoading(true);
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
      setDeletePopup(false);
      setDeleteLoading(false);
      getItems();
    } catch (error) {
      console.error("❌ Delete Error:", error);
      setDeleteLoading(false);
      alert("Failed to delete item");
    }
  };

  const displayItems = items.length === 0 ? placeholderProducts : items;
  const filteredItems = displayItems.filter((item) =>
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
          ) : paginated.length > 0 ? (
            paginated.map((item) => (
              <div
                className="card"
                key={item.id}
                style={{
                  opacity: item.id < 0 ? 0.5 : 1,
                  pointerEvents: item.id < 0 ? "none" : "auto",
                }}
              >
                {/* actions - visible on hover */}
                {item.id > 0 && (
                  <div className="card-actions">
                    <Link to={`/dashboard/edit/${item.id}`}>
                      <button
                        className="edit-btn"
                        title="Edit product"
                      >
                        ✏️ Edit
                      </button>
                    </Link>

                    <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedItem(item);
                        setDeletePopup(true);
                      }}
                      title="Delete product"
                      disabled={deleteLoading}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {/* image - clickable to show details */}
                {item.id > 0 ? (
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
                      style={{ cursor: "pointer" }}
                    />
                  </Link>
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    style={{ cursor: "default" }}
                  />
                )}

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
        {paginated.length > 0 && items.length > 0 && (
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

        {/* delete popup */}
        {deletePopup && selectedItem && (
          <DeletePopup
            onConfirm={() => {
              if (selectedItem) {
                deleteItem(selectedItem.id);
              }
            }}
            onCancel={() => setDeletePopup(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ReadItems;