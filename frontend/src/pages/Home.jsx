import "../StyleCSS/Main.css";
import { useEffect, useState } from "react";
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
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    const savedCredentials = JSON.parse(localStorage.getItem("credentials"));
    if (savedCredentials) {
      setEmail(savedCredentials.email);
      setPassword(savedCredentials.password);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("https://os-management.onrender.com/api/login", {
        email,
        password,
      });
      console.log(data);

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
                <div>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label>Remember Me</label>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;

// import React from "react";
// import { Link } from "react-router-dom";
// import { MdEmail, MdVisibilityOff } from "react-icons/md";
// import "../StyleCSS/Login.css";
// import "../StyleCSS/Slider.css";

// import slider3 from "../Images/slider-3.jpg";

// function Home() {
//   return (
//     <div className="container">

//         <div className="image-container">
//           {/* <Slider /> */}
//           <img src={slider3} alt="Home Banner" className="home-banner" />
//         </div>

//         <div className="login-box">
//           <div className="logo">
//             <Link to="/" className="logo-link">
//               <img src="home.svg" alt="Home Icon" />
//               <h2>Inventory Management</h2>
//             </Link>
//           </div>

//           <form>
//             <h2 className="title">Sign In</h2>

//             <div className="input-box">
//               <MdEmail className="icon" />
//               <input type="email" placeholder="Enter your Email" required />
//             </div>

//             <div className="input-box">
//               <input
//                 type="password"
//                 placeholder="Enter your Password"
//                 required
//               />
//               <MdVisibilityOff className="icon" />
//             </div>

//             <div className="remember">
//               <label>
//                 <input type="checkbox" /> Remember Me
//               </label>
//               <Link to="/forgot">Forgot Password?</Link>
//             </div>

//             <button type="submit" className="login-btn">
//               Login
//             </button>

//             <div className="signup-link">
//               Don't have an account? <Link to="/signup">Sign Up</Link>
//             </div>
//           </form>
//         </div>

//     </div>
//   );
// }

// export default Home;
