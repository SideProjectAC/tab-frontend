import GoogleButton from "react-google-button";
import { googleOauthAPI } from "../../api/oauthAPI";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();
  const handleGoogleSubmit = () => {
    chrome.runtime.sendMessage({ action: "authenticate" }, async (response) => {
      if (response && response.code) {
        const redirectUri = chrome.identity.getRedirectURL();
        const token = {
          authorization_code: response.code,
          redirect_url: redirectUri,
        };
        try {
          const response = await googleOauthAPI(token);
          localStorage.setItem("authToken", response.data.token);
          navigate("/main");
          location.reload();
        } catch (error) {
          console.error("Error during Google OAuth:", error);
        }
      }
    });
  };
  return <GoogleButton className="login-button" onClick={handleGoogleSubmit} />;
};

export default GoogleLogin;
