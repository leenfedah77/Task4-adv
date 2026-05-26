
import Form from "../components/Form/Form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./AddItem.module.css";
import Sidebar from "../components/Sidebar/Sidebar";
import type { ItemCreated } from "./Edit";

const AddItem = () => {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(
    null
  );

  const submitData = async (
    formData: ItemCreated
  ) => {
    setError(null);

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
          },
        }
      );

      console.log("SUCCESS:", res.data);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err: any) {
      console.log("ERROR:", err);

      setError(
        err?.response?.data?.message ||
          "Upload failed"
      );
    }
  };

  return (
    <div className={styles.addpage}>
      <Sidebar />

      <div className={styles.addcontainer}>
        {error && (
          <p style={{ color: "red" }}>
            {error}
          </p>
        )}

        <Form
          title="ADD NEW ITEM"
          submit="SAVE"
          onSubmit={submitData}
          inputs={[
            {
              name: "name",
              type: "text",
              placeholder: "Name",
            },
            {
              name: "price",
              type: "text",
              placeholder: "Price",
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
