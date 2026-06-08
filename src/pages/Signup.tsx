import { useNavigate, Link } from "react-router-dom";
import Form from "../components/Form/Form";
import styles from "./Signup.module.css";
import type { RegisterData } from "../interfaces";

const Signup = () => {
  const navigate = useNavigate();

  const submitData = async (formData: RegisterData) => {
    const body = new FormData();

    body.append("first_name", formData.first_name);
    body.append("last_name", formData.last_name);
    body.append("user_name", formData.user_name);
    body.append("email", formData.email);
    body.append("password", formData.password);
    body.append(
      "password_confirmation",
      formData.password_confirmation
    );

    if (formData.profile_image) {
      body.append("profile_image", formData.profile_image);
    }

    try {
      const response = await fetch(
        "https://dashboard-i552.onrender.com/api/register",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body,
        }
      );

      const res = await response.json();

      console.log("Signup Response:", res);

      if (res.data?.token) {
        localStorage.setItem(
          "token",
          `Bearer ${res.data.token}`
        );
        navigate("/dashboard");
      } else if (res.token) {
        localStorage.setItem(
          "token",
          `Bearer ${res.token}`
        );
        navigate("/dashboard");
      } else {
        console.log("Register failed");
        alert(res.message || "Registration failed");
      }
    } catch (err: any) {
      console.log("Signup Error:", err);
      alert("An error occurred during registration");
    }
  };

  return (
    <div className={styles.signupcontainer}>
      <div className={styles.signupcard}>
        <img
          src="/image/logo.png"
          alt="logo"
          className="signup-logo"
        />

        <h2 className={styles.signuptitle}>SIGN UP</h2>

        <p className={styles.signupsubtitle}>
          Fill in the following fields to create account
        </p>
        <Form<RegisterData>
          title=""
          submit="SIGN UP"
          onSubmit={submitData}
          inputs={[
            {
              type: "text",
              name: "first_name",
              placeholder: "First name",
            },
            {
              type: "text",
              name: "last_name",
              placeholder: "Last name",
            },
            {
              type: "text",
              name: "user_name",
              placeholder: "User name",
            },
            {
              type: "email",
              name: "email",
              placeholder: "Enter your email",
            },
            {
              type: "password",
              name: "password",
              placeholder: "Enter your password",
            },
            {
              type: "password",
              name: "password_confirmation",
              placeholder: "Re-enter password",
            },
            {
              type: "file",
              name: "profile_image",
              placeholder: "",
            },
          ]}
        />

        <p className={styles.signupfooter}>
          Do you have an account?
          <Link to="/"> Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;