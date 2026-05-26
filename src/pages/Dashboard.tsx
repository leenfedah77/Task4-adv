
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      await axios.post(
        "https://dashboard-i552.onrender.com/api/logout",
        {},
        {
          headers: {
            Authorization: token,
            Accept: "application/json",
          },
        }
      );

      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.log(error);
      setError("There is an error with logout or server connection");

      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <>
      <button onClick={logout}>Logout</button>

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>
          {error}
        </p>
      )}

      <Outlet />
    </>
  );
};

export default Dashboard;

