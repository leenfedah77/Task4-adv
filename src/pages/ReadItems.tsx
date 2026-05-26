/*
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import DeletePopup from "../components/DeletePopup/DeletePopup";
import "./ReadItems.css";
import  type { Item } from "../interfaces";


const ReadItems = () => {
  const [items, setItems] = useState<Item[]>(
    []
  );

  const [page, setPage] = useState(1);

  const [popup, setPopup] =
    useState(false);

  const [selected, setSelected] =
    useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  const perPage = 6;
 
  const getItems = async () => {
    try {
      const res = await axios.get(
        "https://dashboard-i552.onrender.com/api/items",
        {
          headers: {
            Authorization:
              localStorage.getItem(
                "token"
              ) || "",
          },
        }
      );

      setItems(res.data.data || []);
    } catch (error) {
      console.log(
        "Error fetching items",
        error
      );
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const deleteItem = async (
    id: number
  ) => {
    try {
      await axios.delete(
        `https://dashboard-i552.onrender.com/api/items/${id}`,
        {
          headers: {
            Authorization:
              localStorage.getItem(
                "token"
              ) || "",
          },
        }
      );

      setPopup(false);

      getItems();
    } catch (error) {
      console.log(
        "Delete Error",
        error
      );
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
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
            placeholder="Search product by name"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          <Link to="/dashboard/add">
            <button>
              ADD NEW PRODUCT
            </button>
          </Link>
        </div>

        <div className="grid">
          {paginated.map((item) => (
            <div
              className="card"
              key={item.id}
            >
              <Link
                to={`/dashboard/show/${item.id}`}
              >
                <img
                  src={
                    item.image_url ||
                    "https://via.placeholder.com/200"
                  }
                  alt={item.name}
                  onError={(event) =>
                    (event.currentTarget.src =
                      "https://via.placeholder.com/200")
                  }
                />
              </Link>

              <h3>{item.name}</h3>

              <p>{item.price}$</p>

              <div>
                <Link
                  to={`/dashboard/edit/${item.id}`}
                >
                  <button>
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => {
                    setSelected(item.id);

                    setPopup(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        

        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            &lt;
          </button>

          <span>{page}</span> 
          <button
            disabled={
              page * perPage >=
              filteredItems.length
            }
            onClick={() =>
              setPage(page + 1)
            }
          >
            &gt;
          </button>
        </div>

       

        {popup && (
          <DeletePopup
            onConfirm={() =>
              selected &&
              deleteItem(selected)
            }
            onCancel={() =>
              setPopup(false)
            }
          />
        )}
      </div>
    </div>
  );
};

export default ReadItems;  */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import DeletePopup from "../components/DeletePopup/DeletePopup";
import "./ReadItems.css";

export interface Item {
  created_at: string;
  updated_at: string;
  id: number;
  image_url: string;
  name: string;
  price: string;
}

const ReadItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const perPage = 6;

  const defaultImage =
    "https://via.placeholder.com/300x200?text=No+Image";

  const getItems = async () => {
    try {
      const res = await axios.get(
        "https://dashboard-i552.onrender.com/api/items",
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      setItems(res.data.data || []);
    } catch (error) {
      console.log("Error fetching items", error);
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const deleteItem = async (id: number) => {
    try {
      await axios.delete(
        `https://dashboard-i552.onrender.com/api/items/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      setPopup(false);
      getItems();
    } catch (error) {
      console.log("Delete Error", error);
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
            placeholder="Search product by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Link to="/dashboard/add">
            <button className="add-btn">ADD NEW PRODUCT</button>
          </Link>
        </div>

        {/* grid */}
        <div className="grid">
          {paginated.map((item) => (
            <div className="card" key={item.id}>
              
              {/* actions */}
              <div className="card-actions">
                <Link to={`/dashboard/edit/${item.id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>

                <button
                  className="delete-btn"
                  onClick={() => {
                    setSelected(item.id);
                    setPopup(true);
                  }}
                >
                  Delete
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
              <p>{item.price}$</p>
            </div>
          ))}
        </div>

        {/* pagination */}
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            {"<"}
          </button>

          <span>{page}</span>

          <button
            disabled={page * perPage >= filteredItems.length}
            onClick={() => setPage(page + 1)}
          >
            {">"}
          </button>
        </div>
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