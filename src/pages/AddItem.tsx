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
    setError(null);
    setLoading(true);

    const body = new FormData();

    body.append("name", formData.name);
    body.append("price", formData.price);
    body.append("image", formData.image);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "https://dashboard-i552.onrender.com/api/items",
        body,
        {
          headers: {
            Authorization: token || "",
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("SUCCESS:", res.data);
      setLoading(false);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.log("ERROR:", err);
      setLoading(false);

      setError(
        err?.response?.data?.message ||
          "Upload failed. Please try again."
      );
    }
  };

  return (
    <div className={styles.addpage}>
      <Sidebar />

      <div className={styles.addcontainer}>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Form
          title="ADD NEW ITEM"
          submit={loading ? "Loading..." : "SAVE"}
          onSubmit={submitData}
          inputs={[
            {
              name: "name",
              type: "text",
              placeholder: "Product Name",
            },
            {
              name: "price",
              type: "text",
              placeholder: "Product Price",
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