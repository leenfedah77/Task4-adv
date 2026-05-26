// Sidebar.tsx
//import { Navigate } from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {
  /*const logout=()=>{
    if(localStorage.getItem("token")){
      fetch("https://dashboard-i552.onrender.com/api/logout" , {
        method:"POST",
        headers:{
          "AUTHORIZATION":localStorage.getItem("token"),
          "Accept":"application/json"
        }
      })
      .then(res=>res.json())
      .then(res=>{

        console.log(res)
        localStorage.removeItem("token")
      })
      .catch(err=>console.log(err))
    }
  }*/
  return (
    <div className="sidebar">
     <img  className=' focal' src="/image/focal.png" alt="img" />

      <div className="profile">
        <img
          src="/image/avatar.jpg"
          alt=""
        />

        <h3>Leen Fedah</h3>
      </div>

      <div className="menu">
        <button className="active"><img className="icon" src="/image/Vector.png" alt='image' />Products</button>
        <button><img className="icon" src="/image/Vector (1).png" alt='image' />Favorites</button>
        <button><img className="icon" src="/image/Vector (1).png" alt='image' />Order List</button>
      </div>

      <div className="logout">
        <button >Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;