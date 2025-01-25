import { useState } from "react";
import "../StyleCSS/Main.css";
import { Link } from "react-router-dom";
import Header from "../Header/Header";
import toast from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8000/api/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setSubmitted(true);
        toast.success("Password sent in taken Email");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
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
      </div>
      <div className="home-container">
        <div className="login-form-container">
          <div>
            <img src="login-v2.svg" alt="images logo" className="login-img" />
          </div>

          <form onSubmit={handleSubmit} className="form-forget">
            <h2>Forgot Password</h2>
            {!submitted ? (
              <>
                <div className="input-groups">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="button">Submit</button>
              </>
            ) : (
              <p>
                If an account with that <Link to="/">Email</Link> exists, a
                reset link has been sent
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
