

//import { useEffect, useState } from "react";
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
                     {
                       //method: "POST",
                       headers: {
                         Accept: "application/json",
                       },
                       body,
                     }
                   );
             
                   //const res = await response.json();
             
                   console.log(response);
             
                   if (response.data?.token) {
             
                     localStorage.setItem(
                       "token",
                       `Bearer ${response.data.token}`
                     );
             
                     navigate("/dashboard");
             
                   } else {
             
                     console.log("Register failed");
             
                   }
             
                 } catch (err) {
             
                   console.log(err);
             
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
              placeholder: "Enter your email"
            },
            {
              name: "password",
              type: "password",
              placeholder: "Enter your password"
            }
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
