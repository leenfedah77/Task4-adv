import Form from "../components/Form/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AddItem.module.css";
import Sidebar from "../components/Sidebar/Sidebar";
import type { ItemCreated } from "../interfaces";

const AddItem = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitData = async (formData: ItemCreated) => {
    try {
      setError(null);
      setLoading(true);

      // التحقق من البيانات
      if (!formData.name || !formData.price || !formData.image) {
        setError("Please fill all fields including image");
        setLoading(false);
        return;
      }

      const body = new FormData();
      body.append("name", formData.name);
      body.append("price", formData.price);
      body.append("image", formData.image);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in");
        setLoading(false);
        navigate("/");
        return;
      }

      // تصحيح الـ headers
      const config = {
        headers: {
          Authorization: token,
          Accept: "application/json",
        },
      };

      const res = await axios.post(
        "https://dashboard-i552.onrender.com/api/items",
        body,
        config
      );

      console.log("✅ SUCCESS:", res.data);
      setLoading(false);

      // انتظر قليلاً قبل الانتقال
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error("❌ ERROR:", err.response?.data || err.message);
      setLoading(false);

      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Upload failed. Please try again.";

      setError(errorMsg);
    }
  };

  return (
    <div className={styles.addpage}>
      <Sidebar />

      <div className={styles.addcontainer}>
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          ➕ ADD NEW PRODUCT
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

        <Form
          title=""
          submit={loading ? "⏳ Loading..." : "✅ SAVE PRODUCT"}
          onSubmit={submitData}
          inputs={[
            {
              name: "name",
              type: "text",
              placeholder: "Enter product name",
            },
            {
              name: "price",
              type: "number",
              placeholder: "Enter product price",
            },
            {
              name: "image",
              type: "file",
              placeholder: "",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default AddItem;