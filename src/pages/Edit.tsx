
import Sidebar from "../components/Sidebar/Sidebar";
import styles from "./Edit.module.css";
import Form from "../components/Form/Form";
import { useEffect, useState } from "react";
import type { Item } from "../interfaces";
import axios from "axios";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

export type ItemCreated = Omit<
  Item,
  "created_at" |
    "id" |
    "updated_at" |
    "image_url"
> & {
  image: Blob;
};

const Edit = () => {
  const [oldData, setOldData] =
    useState<Item>();

  const [error, setError] = useState<
    string | null
  >(null);

  const [preview, setPreview] =
    useState<string>("");

  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await axios.get(
          `https://dashboard-i552.onrender.com/api/items/${id}`,
          {
            headers: {
              Authorization:
                localStorage.getItem(
                  "token"
                ) || "",
              Accept:
                "application/json",
            },
          }
        );

        setOldData(response.data.data);

        setPreview(
          response.data.data.image_url
        );
      } catch (err) {
        console.log(err);
      }
    };

    getItem();
  }, [id]);

  const submitData = async (
    formData: ItemCreated
  ) => {
    setError(null);

    const body = new FormData();

    body.append(
      "name",
      formData.name
        ? formData.name
        : oldData?.name || ""
    );

    body.append(
      "price",
      formData.price
        ? formData.price
        : oldData?.price || ""
    );

    if (formData.image) {
      body.append(
        "image",
        formData.image
      );
    }

    body.append("_method", "PUT");

    try {
      const response = await axios.post(
        `https://dashboard-i552.onrender.com/api/items/${id}`,
        body,
        {
          headers: {
            Authorization:
              localStorage.getItem(
                "token"
              ) || "",
            Accept:
              "application/json",
          },
        }
      );

      console.log(response.data);

      navigate("/dashboard");
    } catch (err: any) {
      console.log(err);

      setError(
        err?.response?.data?.message ||
          "Failed to update item"
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

        <div className={styles.previewBox}>
          <img
            src={
              preview ||
              "https://via.placeholder.com/300"
            }
            alt="preview"
            className={styles.previewImage}
          />
        </div>

        <Form<ItemCreated>
          title="EDIT ITEM"
          submit="SAVE"
          onSubmit={submitData}
          inputs={[
            {
              type: "text",
              name: "name",
              placeholder: "Item name",
              value: oldData?.name,
            },
            {
              type: "text",
              name: "price",
              placeholder: "Item price",
              value: oldData?.price,
            },
            {
              type: "file",
              name: "image",
              placeholder: "",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Edit;


