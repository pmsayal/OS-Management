import "../StyleCSS/Main.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import Signin from "../Login-Form/Signin";
import toast from "react-hot-toast";
import axios from "axios";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://os-management.onrender.com/api/login", {
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error);
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error("Login failed. Try again.");
    }
  };

  const handleSignUpClick = () => {
    setIsLogin(true);
  };

  return (
    <div>
      {isLogin ? (
        <Signin />
      ) : (
        <>
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
            <div className="logout">
              <h3>
                <FaUser className="User" />
                {/* <a href="" onClick={handleSignUpClick} style={{ cursor: "pointer" }}>
                  Sign UP
                </a> */}
                <p onClick={handleSignUpClick} style={{ cursor: "pointer" }} className="SIGNUP">Sign UP</p>
              </h3>
            </div>
          </div>

          <div className="home-container">
            <div className="login-form-container">
              <div>
                <img
                  src="login-v2.svg"
                  alt="images logo"
                  className="login-img"
                />
              </div>

              <form onSubmit={handleSubmit} className="form">
                <h2>Sign-in</h2>
                <div className="input-groups">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                    <MdEmail className="icon" />
                  </div>
                  <span className="error"></span>
                </div>

                <div className="input-groups">
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                    {showPassword ? (
                      <MdVisibilityOff
                        className="icon"
                        onClick={togglePasswordVisibility}
                      />
                    ) : (
                      <MdVisibility
                        className="icon"
                        onClick={togglePasswordVisibility}
                      />
                    )}
                  </div>
                  <span className="error"></span>
                </div>
                <div className="switch">
                  <div className="buttonForget">
                    <Link to="/forgot" >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button className="button" type="submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
