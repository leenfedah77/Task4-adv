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
    "/image/iphone.webp";


  const placeholderProducts: Item[] = [
    {
      id: -1,
      name: "Premium Headphones",
      price: "99.99",
      image_url: "https://via.placeholder.com/400x300?text=Premium+Headphones&bg=FF6B6B&textColor=fff",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: -2,
      name: "Wireless Mouse",
      price: "49.99",
      image_url: "https://via.placeholder.com/400x300?text=Wireless+Mouse&bg=4ECDC4&textColor=fff",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: -3,
      name: "USB-C Cable",
      price: "19.99",
      image_url: "https://via.placeholder.com/400x300?text=USB-C+Cable&bg=45B7D1&textColor=fff",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: -4,
      name: "Phone Stand",
      price: "29.99",
      image_url: "https://via.placeholder.com/400x300?text=Phone+Stand&bg=FFA502&textColor=fff",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
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

      console.log(" Items loaded:", res.data);
      setItems(res.data.data || res.data || []);
      setLoading(false);
    } catch (error: any) {
      console.error(" Error fetching items:", error);
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

      console.log(" Product deleted successfully");
      setDeletePopup(false);
      setSelectedItem(null);
      setDeleteLoading(false);
      await getItems();
    } catch (error) {
      console.error(" Delete Error:", error);
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
        
        <div className="topbar">
          <input
            placeholder=" Search product by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link to="/dashboard/add">
            <button className="add-btn"> ADD NEW PRODUCT</button>
          </Link>
        </div>

        
        {error && (
          <div className="error-banner">
            {error}
          </div>
        )}

       
        <div className="grid">
          {loading ? (
            <div className="loading-container">
              <p> Loading products...</p>
            </div>
          ) : paginated.length > 0 ? (
            paginated.map((item) => (
              <div
                className="card"
                key={item.id}
                style={{
                  opacity: item.id < 0 ? 0.6 : 1,
                  pointerEvents: item.id < 0 ? "none" : "auto",
                }}
              >
               
                {item.id > 0 && (
                  <div className="card-actions">
                    <Link to={`/dashboard/edit/${item.id}`}>
                      <button
                        className="edit-btn"
                        title="Edit product"
                      >
                         EDIT
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
                       DELETE
                    </button>
                  </div>
                )}

                
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
                      className="card-image"
                    />
                  </Link>
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="card-image placeholder"
                  />
                )}

                <div className="card-content">
                  <h3>{item.name}</h3>
                  <p className="price">${item.price}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-container">
              <p> No products match your search</p>
            </div>
          )}
        </div>

        
        {paginated.length > 0 && items.length > 0 && (
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← 
            </button>

            <span>Page {page}</span>

            <button
              disabled={page * perPage >= filteredItems.length}
              onClick={() => setPage(page + 1)}
            >
              →
            </button>
          </div>
        )}

        
        {deletePopup && selectedItem && (
          <DeletePopup
            onConfirm={() => {
              if (selectedItem) {
                deleteItem(selectedItem.id);
              }
            }}
            onCancel={() => {
              setDeletePopup(false);
              setSelectedItem(null);
            }}
            loading={deleteLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ReadItems;