import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../Form.module.css";
import FileUploadForm from "./FileUploadForm";
const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setIsLoggedIn(true);
    }
  }, []);

  const onSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
        setLoading(false);
        setIsLoggedIn(true);

        if (rememberMe) {
          localStorage.setItem("token", response.data.token);
        }

        // alert("Logged in successfully!");
      } else {
        setLoading(false);
        alert("User does not exist");
      }
    } catch (error) {
      console.error("User does not exist", error);
      setLoading(false);
      alert("User does not exist");
    }
  };

  const onLogout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/auth/logout");

      if (response.status === 200) {
        setIsLoggedIn(false);
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
        setLoading(false);
        // alert("Logged out successfully!");
      } else {
        setLoading(false);
        alert("Failed to logout");
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to logout", error);
      alert("Failed to logout");
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <div className={styles.absoluteWrapper}>
        <img src="/ring.png" alt="ring" />
      </div>
      <div className={styles.maxWidthWrapper}>
        {isLoggedIn ? (
          <>
            <FileUploadForm />
            <button className={styles.logoutButton} onClick={onLogout}>
              {loading ? "Logging out..." : "Log Out"}
            </button>
          </>
        ) : (
          <>
            <h4 className={styles.loginTitle}>Login</h4>
            <form className={styles.formWrapper} onSubmit={onSubmit}>
              <div className={styles.inputWrapper}>
                <label className={styles.labelWrapper} htmlFor="">
                  Username
                </label>
                <input
                  className={styles.inputField}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  required
                />
              </div>
              <div className={styles.inputWrapper}>
                <label className={styles.labelWrapper} htmlFor="password">
                  Password
                </label>
                <div className={styles.inputGroup}>
                  <input
                    className={styles.inputField}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordIcon}
                  >
                    {showPassword ? "👁️‍🗨️" : "👁"}
                  </div>
                </div>
              </div>

              <div className={styles.checkboxContainer}>
                <input
                  className={styles.checkbox}
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className={styles.checkboxLabel}>Remember me</span>
              </div>

              <button className={styles.submitButton} type="submit">
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
