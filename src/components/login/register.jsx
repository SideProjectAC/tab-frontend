import { useState } from "react";
import { registerAPI } from "../../api/loginAPI";
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "./GoogleLogin";
import "../../scss/login/register.scss";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

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
      const response = await registerAPI(userInfo);
      // console.log('Login successful:', response.data);
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
    <div className="register-wrapper">
      <img
        src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/tab_pane.png"
        alt="logo"
        className="register-logo"
      />
      <h1>REGISTER</h1>
      <input
        className="register-input "
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => handleValueChange(e, setEmail)}
      />
      <input
        className="register-input "
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => handleValueChange(e, setPassword)}
        onKeyDown={(e) => handleKeyDown(e)}
      />
      {loginError && <p className="loginError">{loginError}</p>}
      <button className="register-button" onClick={handleSubmit}>
        {" "}
        register{" "}
      </button>
      <Link to="/Login">Login</Link>
      <GoogleLogin />
    </div>
  );
}

export default Register;
