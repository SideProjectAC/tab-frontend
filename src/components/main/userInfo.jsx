import { useState, useEffect } from "react";
import {
  getUserInfoAPI,
  deleteUserAPI,
  updateUserAPI,
} from "../../api/loginAPI";

const UserInfo = ({ setShowUserInfo }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await getUserInfoAPI();
      setEmail(response.data.email);
    };

    fetchUserInfo();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    if (newPassword !== confirmPassword) {
      setPasswordError("confirm new password again");
    } else {
      e.preventDefault();
      handleChangePassword();
    }
  };

  const handleChangePassword = async () => {
    const updatePassword = { password: newPassword };
    try {
      setPasswordError("");
      await updateUserAPI(updatePassword);
      alert("password changed");
      setShowPasswordInput(false);
    } catch (error) {
      if (error.response) {
        console.error("error:", error.response.data);
        setPasswordError(error.response.data.message);
      } else if (error.request) {
        console.error("error: No response from the server", error.request);
      } else {
        console.error("error:", error.message);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`do you want to DELETE account with email ${email} ?`)) {
      try {
        await deleteUserAPI();
        localStorage.removeItem("authToken");
        location.reload();
      } catch (error) {
        console.error("error in deleting account", error);
      }
    }
  };

  return (
    <div className="userInfoBackground">
      <div className="userWrapper">
        <button
          className="userCloseButton"
          onClick={() => setShowUserInfo(false)}
        >
          x
        </button>
        <h3 className="userTitle"> User email : {email} </h3>

        <div className="userButtons">
          <button
            className="userButton"
            onClick={() => {
              setShowPasswordInput(true);
              if (showPasswordInput && newPassword && newPassword.length !== 0)
                handleChangePassword();
            }}
          >
            {" "}
            Change <br /> Password
          </button>

          <button className="userButton" onClick={handleDelete}>
            {" "}
            Delete <br /> Account{" "}
          </button>
        </div>

        {showPasswordInput && (
          <>
            <input
              className="newPassword"
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: "5px" }}
            />
            <input
              className="newPassword"
              type="password"
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
            {passwordError && <p className="login-error">{passwordError}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default UserInfo;
