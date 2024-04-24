import { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleHalfStroke,
  faList,
  faPalette,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../useContext/themeContext";

import Tab from "./popupTab";
import PopupGroups from "./popupShowGroups";
import { popupContentPropTypes } from "../main/propTypes";
Tab.propTypes = popupContentPropTypes;

function PopupContent() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const [currentTab, setCurrentTab] = useState(null);
  const [showGroups, setShowGroups] = useState(false);
  const [note, setNote] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      setCurrentTab(activeTab);
    });

    document.documentElement.setAttribute("data-theme", theme);
  }, [currentTab, theme]);

  const handleShowSave = () => {
    if (note.length === 0) return;
    setShowGroups(true);
  };

  return (
    <>
      <div id="header">
        {/* <p>Click here to move</p> */}
        <FontAwesomeIcon
          icon={faXmark}
          className="popup-button delete"
          onClick={() => window.close()}
        />
      </div>

      {showGroups && (
        <PopupGroups
          note={note}
          // backgroundColor = {backgroundColor} //for note background color
          setShowGroups={setShowGroups}
          currentTab={currentTab}
        />
      )}

      {currentTab && <Tab currentTab={currentTab} />}

      <form>
        <textarea
          className="popupNote"
          onChange={(e) => setNote(e.target.value)}
          placeholder="New note"
          value={note}
        ></textarea>
        {/* <button onClick={handleShowSave} className="popup-save">
          SAVE
        </button> */}
      </form>
      {/* <div className="popup-buttons">
        <FontAwesomeIcon
          icon={faCircleHalfStroke}
          className="popup-button theme"
          onClick={toggleTheme}
        />
        <FontAwesomeIcon icon={faList} className="popup-button todo" />
        <FontAwesomeIcon icon={faPalette} className="popup-button color" /> */}
      <button className="popup-button save" onClick={handleShowSave}>
        Save
      </button>
      {/* </div> */}
    </>
  );
}

export default PopupContent;
