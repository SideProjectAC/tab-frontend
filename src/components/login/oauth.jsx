import { useEffect } from "react";

const Oauth = () => {
  function handleCallbackResponse(response) {
    console.log("token from google", response.credential);
  }

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id:
        "1059887522325-mgt5j9krtsca2ldee6toac62fn5g19ke.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("signInGoogle"),
      { theme: "outlined", size: "large" }
    );
  }, []); // Added dependency array

  return <div id="signInGoogle"></div>;
};

export default Oauth;
