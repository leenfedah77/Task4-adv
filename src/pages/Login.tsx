import axios from "axios";
import Form from "../components/Form/Form";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import type { loginData } from "../interfaces";

const Login = () => {
  const navigate = useNavigate();

  const submitData = async (formData: loginData) => {
    const body = new FormData();
    body.append("email", formData.email);
    body.append("password", formData.password);

    try {
      const response = await axios.post(
        "https://dashboard-i552.onrender.com/api/login",
        body,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Login Success:", response.data);

      if (response.data?.data?.token) {
        localStorage.setItem(
          "token",
          `Bearer ${response.data.data.token}`
        );
        navigate("/dashboard");
      } else if (response.data?.token) {
        localStorage.setItem(
          "token",
          `Bearer ${response.data.token}`
        );
        navigate("/dashboard");
      } else {
        console.log("Login failed: No token received");
      }
    } catch (err: any) {
      console.log("Login Error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <>
      <div className={styles.logincontainer}>
        <div className={styles.logincard}>
          <img
            src="/image/logo.png"
            alt="logo"
            className="login-logo"
          />

          <h2 className={styles.logintitle}>SIGN IN</h2>

          <p className={styles.loginsubtitle}>
            Enter your credentials to access your account
          </p>

          <Form<loginData>
            title=""
            submit="SIGN IN"
            onSubmit={submitData}
            inputs={[
              {
                name: "email",
                type: "email",
                placeholder: "Enter your email",
              },
              {
                name: "password",
                type: "password",
                placeholder: "Enter your password",
              },
            ]}
          />

          <p className={styles.loginfooter}>
            Don't have an account?
            <Link to="/signup"> Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;