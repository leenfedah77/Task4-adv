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
      if (input.type === "file") return;
      if (!data.current[input.name] || data.current[input.name].trim() === "") {
        newErrors[input.name] = `${input.name} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendData = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

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

  const handleImageChange = (inputName: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview((prev) => ({
          ...prev,
          [inputName]: e.target?.result as string,
        }));
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
      <h1 className={styles.formtitle}>{title}</h1>

      <div className={styles.formcontent}>
        <div className={styles.inputcontainer}>
          {inputs.map((input, index) => {
            return input.type !== "file" ? (
              <div className={styles.inputgroup} key={index}>
                <label className={styles.inputlabel}>
                  {input.name}
                </label>

                <input
                  className={styles.formInput}
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  defaultValue={input.value}
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
            ) : (
              <div className={styles.imagecontainer} key={index}>
                <label className={styles.imagetitle}>
                  Image
                </label>

                <label className={styles.imagebox}>
                  {imagePreview[input.name] || input.value ? (
                    <img
                      src={imagePreview[input.name] || input.value}
                      alt="preview"
                      width={200}
                      className={styles.previewimage}
                    />
                  ) : (
                    <span className={styles.uploadtext}>
                      📸 Click to upload image
                    </span>
                  )}

                  <input
                    className={styles.imageinput}
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    onChange={(event) => handleImageChange(input.name, event)}
                    required={!imagePreview[input.name] && !input.value}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <button className="submitBtn" disabled={isSubmitting}>
        {submit}
      </button>
    </form>
  );
};

export default Form;