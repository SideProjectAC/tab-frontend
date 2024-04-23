import PopupContent from "./popupContent";
import { ThemeProvider } from "../useContext/themeContext";

function PopupDrag() {
  return (
    <ThemeProvider>
      <div className="myDiv">
        <PopupContent />
      </div>
    </ThemeProvider>
  );
}

export default PopupDrag;
