import PopupContent from "./PopupContent";
import { ThemeProvider } from "../useContext/ThemeContext";
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
