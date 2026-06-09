import { useRef, type FormEvent, useState } from "react";
import type { loginData } from "../../interfaces";
import type { RegisterData } from "../../interfaces";
import type { ItemCreated } from "../../interfaces";
import styles from "./Form.module.css";
import type { Input } from "../../interfaces";

type FormValues = loginData | RegisterData | ItemCreated;

interface FormProps<T extends FormValues> {
  title: string;
  inputs: Array<Input>;
  submit: string;
  setData?: (data: T) => void;
  setSubmit?: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (data: T) => void | Promise<void>;
}

const Form = <T extends FormValues>({
  title,
  inputs,
  submit,
  setData,
  setSubmit,
  onSubmit,
}: FormProps<T>) => {
  const data = useRef<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    inputs.forEach((input) => {
      
      if (input.type === "file" && imagePreview[input.name]) {
        return;
      }

      
      if (
        input.type !== "file" &&
        (!data.current[input.name] ||
          data.current[input.name].toString().trim() === "")
      ) {
        newErrors[input.name] = `${input.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = { ...data.current } as T;

      if (setData) {
        setData(formData);
      }

      if (onSubmit) {
        await onSubmit(formData);
      }

      setSubmit?.(true);
    } catch (error) {
      console.log("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (
    inputName: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview((prev) => ({
          ...prev,
          [inputName]: result,
        }));
        console.log("📸 Image preview ready:", inputName);
      };
      reader.readAsDataURL(file);
      data.current = {
        ...data.current,
        [inputName]: file,
      };
    }
  };

  return (
    <form onSubmit={sendData} className={styles.formmain}>
      {title && <h1 className={styles.formtitle}>{title}</h1>}

      <div className={styles.formcontent}>
        <div className={styles.inputcontainer}>
          {inputs.map((input, index) => {
            if (input.type !== "file") {
              return (
                <div className={styles.inputgroup} key={index}>
                  <label className={styles.inputlabel}>{input.name}</label>

                  <input
                    className={styles.formInput}
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    defaultValue={input.value || ""}
                    required
                    onChange={(event) => {
                      data.current = {
                        ...data.current,
                        [input.name]: event.target.value,
                      };
                      setErrors((prev) => ({
                        ...prev,
                        [input.name]: "",
                      }));
                    }}
                  />
                  {errors[input.name] && (
                    <span style={{ color: "red", fontSize: "12px" }}>
                       {errors[input.name]}
                    </span>
                  )}
                </div>
              );
            } else {
              return (
                <div className={styles.imagecontainer} key={index}>
                  <label className={styles.imagetitle}> Image</label>

                  <label className={styles.imagebox}>
                    {imagePreview[input.name] ? (
                      <img
                        src={imagePreview[input.name]}
                        alt="preview"
                        className={styles.previewimage}
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    ) : input.value ? (
                      <img
                        src={input.value}
                        alt="existing"
                        className={styles.previewimage}
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          minHeight: "150px",
                        }}
                      >
                        <span style={{ fontSize: "48px" }}></span>
                        <span className={styles.uploadtext}>
                          Click to upload image
                        </span>
                      </div>
                    )}

                    <input
                      className={styles.imageinput}
                      type="file"
                      name={input.name}
                      accept="image/*"
                      onChange={(event) => handleImageChange(input.name, event)}
                      required={!imagePreview[input.name] && !input.value}
                    />
                  </label>
                </div>
              );
            }
          })}
        </div>
      </div>
      <button
        className="submitBtn"
        disabled={isSubmitting}
        type="submit"
        style={{
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {submit}
      </button>
    </form>
  );
};

export default Form;