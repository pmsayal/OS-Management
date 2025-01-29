import { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./Sign.css";
import "../StyleCSS/Main.css";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Signin() {
  const [login, setLogin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSubmits = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://os-management.onrender.com/api/register", {
        name,
        email,
        password,
      });
      console.log(data);
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Register successful");
        navigate("/dashboard");
        // navigate("/");

      }
    } catch (err) {
      console.log(err);
      toast.error("Login failed. Try again.");
    }
  };

  return (
    <div>
      <div className="navbar">
        <div>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h2>
              <span className="span">
                <img src="home.svg" alt="home icon" />
              </span>
              Order Management
            </h2>
          </Link>
        </div>
      </div>
      <div className="home-container">
        <div className="login-form-container">
          <div>
            <img src="login-v2.svg" alt="images logo" className="login-img" />
          </div>
          <>
            <form onSubmit={onSubmits} className="Sign-Up-form">
              <h2>Sign Up</h2>
              <div className="input-groups">
                <div>
                  <input
                    type="name"
                    placeholder="name "
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <span className="error">{}</span>
              </div>
              <div className="input-groups">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <span className="error">{}</span>
              </div>
              <div className="input-groups">
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <span className="error">{}</span>
              </div>

              <button type="submit" className="button">Sign Up</button>
            </form>
          </>
        </div>
      </div>
    </div>
  );
}

export default Signin;
