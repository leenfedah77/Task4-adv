import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./Edit.module.css";
import Form from "../components/Form/Form";
import { useEffect, useState } from "react";
import type { Item, ItemCreated } from "../interfaces";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Edit = () => {
  const [oldData, setOldData] = useState<Item>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(true);
  const [preview, setPreview] = useState<string>("");
  const [newImage, setNewImage] = useState<string>("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getItem = async () => {
      try {
        setLoadingItem(true);
        const response = await axios.get(
          `https://dashboard-i552.onrender.com/api/items/${id}`,
          {
            headers: {
              Authorization: localStorage.getItem("token") || "",
              Accept: "application/json",
            },
          }
        );

        setOldData(response.data.data);
        setPreview(response.data.data.image_url);
        setLoadingItem(false);
      } catch (err) {
        console.log("Error fetching item:", err);
        setError("Failed to load item details");
        setLoadingItem(false);
      }
    };

    if (id) getItem();
  }, [id]);

  const submitData = async (formData: ItemCreated) => {
    setError(null);
    setLoading(true);

    const body = new FormData();

    body.append(
      "name",
      formData.name ? formData.name : oldData?.name || ""
    );

    body.append(
      "price",
      formData.price ? formData.price : oldData?.price || ""
    );

    if (formData.image) {
      body.append("image", formData.image);
    }

    body.append("_method", "PUT");

    try {
      const response = await axios.post(
        `https://dashboard-i552.onrender.com/api/items/${id}`,
        body,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
            Accept: "application/json",
          },
        }
      );

      console.log("✅ Update Success:", response.data);
      setLoading(false);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.log("❌ Update Error:", err);
      setLoading(false);

      setError(
        err?.response?.data?.message ||
          "Failed to update item"
      );
    }
  };

  // Handle image change for preview
  const handleImagePreview = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.addpage}>
      <Sidebar />

      <div className={styles.addcontainer}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          ✏️ EDIT PRODUCT
        </h2>

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

        {loadingItem ? (
          <p>⏳ Loading product...</p>
        ) : (
          <>
            {/* Image Preview Box */}
            <div className={styles.previewBox}>
              <img
                src={
                  newImage ||
                  preview ||
                  "https://via.placeholder.com/300x200?text=No+Image&bg=E8E8E8&textColor=999"
                }
                alt="product preview"
                className={styles.previewImage}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/300x200?text=No+Image";
                }}
              />
            </div>

            <Form<ItemCreated>
              title=""
              submit={loading ? "⏳ Loading..." : "✅ UPDATE PRODUCT"}
              onSubmit={(formData) => {
                // Update preview when form changes image
                if (formData.image && formData.image instanceof Blob) {
                  handleImagePreview(formData.image);
                }
                submitData(formData);
              }}
              inputs={[
                {
                  type: "text",
                  name: "name",
                  placeholder: "Product name",
                  value: oldData?.name,
                },
                {
                  type: "number",
                  name: "price",
                  placeholder: "Product price",
                  value: oldData?.price,
                },
                {
                  type: "file",
                  name: "image",
                  placeholder: "",
                },
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Edit;