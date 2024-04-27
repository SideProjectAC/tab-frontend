import "../../scss/login/login.scss";
import { useState, useEffect } from "react";
import { loginAPI } from "../../api/loginAPI";
import { Link, useNavigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { googleOauthAPI } from "../../api/oauthAPI";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/main");
    }
  }, [navigate]);

  const handleGoogleSubmit = async () => {
    chrome.runtime.sendMessage({ action: "authenticate" }, (response) => {
      if (response && response.token) {
        const redirectUri = chrome.identity.getRedirectURL();
        console.log("Generated Redirect URI:", redirectUri);
        console.log("OAuth token received:", response.token);
        //POST API ：傳token 跟URL給後端
      } else {
        console.error("Failed to authenticate");
      }
    });
  };

  const handleLogout = () => {
    // Send a message to the background script to log out
    chrome.runtime.sendMessage({ action: "logout" }, (response) => {
      if (response.success) {
        console.log("Logged out successfully");
      } else {
        console.error("Failed to log out");
      }
    });
  };

  function handleValueChange(e, setValue) {
    setValue(e.target.value);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  async function handleSubmit() {
    if (email.length === 0 || password.length === 0) {
      setLoginError("Please enter email and password");
      return;
    }
    const userInfo = {
      email: email,
      password: password,
    };

    try {
      const response = await loginAPI(userInfo);
      const token = response.data.token;
      localStorage.setItem("authToken", token);
      navigate("/main");
      location.reload();
    } catch (error) {
      if (error.response) {
        console.error("Login error:", error.response.data);
        setLoginError(error.response.data.message);
      } else if (error.request) {
        console.error(
          "Login error: No response from the server",
          error.request
        );
      } else {
        console.error("Login error:", error.message);
      }
    }
  }

  return (
    <div className="login-wrapper">
      <img
        src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/tab_pane.png"
        alt="logo"
        className="login-logo"
      />
      <h1>LOGIN</h1>
      <input
        className="login-input"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => handleValueChange(e, setEmail)}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => handleValueChange(e, setPassword)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      {loginError && <p className="login-error">{loginError}</p>}

      <button className="login-button" onClick={handleSubmit}>
        {" "}
        login{" "}
      </button>
      <Link to="/register">Register</Link>
      <GoogleButton className="login-button" onClick={handleGoogleSubmit} />
      <button onClick={handleLogout}>logout Google</button>
    </div>
  );
}
export default Login;
