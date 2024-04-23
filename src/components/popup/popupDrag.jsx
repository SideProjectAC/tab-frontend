import PopupContent from "./popupContent";
import { ThemeProvider } from "../useContext/themeContext";
import "../../scss/popup/popup.scss";

function PopupDrag() {
  return (
    <ThemeProvider>
      <div className="popupBody">
        <div className="myDiv">
          <PopupContent />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default PopupDrag;
