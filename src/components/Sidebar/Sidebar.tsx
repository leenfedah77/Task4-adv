import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

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
    } catch (err) {
      console.log("Logout Error:", err);
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  return (
    <div className="sidebar">
      <img className="focal" src="/image/focal.png" alt="img" />

      <div className="profile">
        <img src="/image/avatar.jpg" alt="avatar" />
        <h3>Leen Fedah</h3>
      </div>

      <div className="menu">
        <button className="active">
          <img className="icon" src="/image/Vector.png" alt="icon" />
          Products
        </button>
        <button>
          <img className="icon" src="/image/Vector (1).png" alt="icon" />
          Favorites
        </button>
        <button>
          <img className="icon" src="/image/Vector (1).png" alt="icon" />
          Order List
        </button>
      </div>

      <div className="logout">
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;