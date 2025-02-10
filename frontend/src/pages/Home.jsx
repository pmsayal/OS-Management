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
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://os-management.onrender.com/login", {
        email,
        password,
      });
      console.log(data)
  
      if (data?.error) {
        toast.error(data.error); 
      } else {
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("Login successful");
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        if (err.response.data.error === "User not found") {
          toast.error("User not found, please check your email");
        } else if (err.response.data.error === "Incorrect password") {
          toast.error("Incorrect password, please try again");
        } else {
          toast.error(err.response.data.error);  
        }
      } else {
        toast.error("Login failed. Try again.");
      }
    }
  };
  
  const handleSignUpClick = () => {
    setIsLogin(true);
  };

  return (
    <div>
      {isLogin ? (
        <Signin setIsLogin={setIsLogin} />
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
                <p
                  onClick={handleSignUpClick}
                  style={{ cursor: "pointer" }}
                  className="SIGNUP"
                >
                  Sign UP
                </p>
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
                      required
                    />
                    <MdEmail className="icon" />
                  </div>
                </div>

                <div className="input-groups">
                  <div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
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
                </div>


                <div className="switch">
                  <div className="buttonForget">
                    <Link to="/forgot">
                      <button className="StyledButton2" type="button">
                        Forgot Password?
                      </button>
                    </Link>
                  </div>
                </div>

                <button className="StyledButton1" type="submit">
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

