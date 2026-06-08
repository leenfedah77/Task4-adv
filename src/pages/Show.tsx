import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Show.css";
import { useNavigate, useParams } from "react-router-dom";
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
        >
          ←
        </div>

        {loading ? (
          <p>Loading product details...</p>
        ) : (
          <>
            <h1 className="title">{item?.name}</h1>

            <div className="imageBox">
              <img
                src={
                  item?.image_url ||
                  "https://via.placeholder.com/300"
                }
                alt={item?.name}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300";
                }}
              />
            </div>

            <div className="info">
              <h2>
                Price:
                <span>{item?.price}$</span>
              </h2>

              <h2>
                Added At:
                <span>
                  {"created_at" in (item || {})
                    ? item?.created_at
                    : "-----"}
                </span>
              </h2>
            </div>

            <div className="updated">
              <h2>
                Updated At:
                <span>
                  {"updated_at" in (item || {})
                    ? item?.updated_at
                    : "-----"}
                </span>
              </h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Show;