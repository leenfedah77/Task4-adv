


import { useRef, type FormEvent } from "react";
import type { loginData } from "../../interfaces";
import type  {RegisterData} from "../../interfaces"
import type { ItemCreated } from "../../pages/Edit";


import styles from "./Form.module.css";

type FormValues = loginData | RegisterData | ItemCreated;
import type { Input } from "../../interfaces";

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

  const sendData = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = { ...data.current } as T;

    if (setData) {
      setData(formData);
    }

    onSubmit?.(formData);

    setSubmit?.(true);
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
                  //onChange={input.onChange}
                  defaultValue={input.value}
                  required
                  onChange={(event) =>
                    (data.current = {
                      ...data.current,
                      [input.name]: event.target.value,
                    })
                  }
                />
              </div>
            ) : (
              <div className={styles.imagecontainer} key={index}>
                <label className={styles.imagetitle}>
                  Image
                </label>

                <label className={styles.imagebox}>
                  {input.value ? (
                    <img
                      src={input.value}
                      alt=""
                      width={200}
                      className={styles.previewimage}
                    />
                  ) : (
                    <span className={styles.uploadtext}>
                      Upload Image
                    </span>
                  )}

                  <input
                    className={styles.imageinput}
                    type={input.type}
                    name={input.name}
                    placeholder={input.placeholder}
                    onChange={(event) =>
                      (data.current = {
                        ...data.current,
                        [input.name]:
                          input.type === "file"
                            ? event?.target?.files?.[0]
                            : event.target.value,
                      })
                    }
                    defaultValue={input.value}
                    required={input.value ? false : true}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>
      <button className="submitBtn">{submit}</button> 
      
    </form>
  );
};

export default Form;