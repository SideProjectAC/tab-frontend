import  { useRef, useEffect, useState } from 'react';
import PopupContent from './popupContent';
import { ThemeProvider } from '../useContext/themeContext';

function PopupDrag() {
  const DivRef = useRef(null); // Reference to the main div
  const [position, setPosition] = useState({ top: 0, left: 0 }); // Position state
  

  useEffect(() => {
    const element = DivRef.current;
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    const dragMouseDown = (e) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    };

    const elementDrag = (e) => {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      setPosition(prevPosition => ({
        top: prevPosition.top - pos2,
        left: prevPosition.left - pos1,
      }));
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
    };

    const headerElement = element.querySelector("#myDivHeader");
    if (headerElement) {
      headerElement.onmousedown = dragMouseDown;
    } else {
      element.onmousedown = dragMouseDown;
    }

    return () => {
      if (headerElement) {
        headerElement.onmousedown = null;
      } else {
        element.onmousedown = null;
      }
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }, []);

  return (
    <ThemeProvider>
      <div
        id="myDiv"
        ref={DivRef}
        style={{ position: 'absolute', top: `${position.top}px`, left: `${position.left}px`}}
      >
      <PopupContent/>
      </div>
    </ThemeProvider>
  );
}

export default PopupDrag;
