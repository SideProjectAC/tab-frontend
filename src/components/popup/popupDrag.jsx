import  { useRef, useEffect, useState } from 'react';
import PopupContent from './popupContent';

function PopupDrag() {
  const mydivRef = useRef(null); // Reference to the main div
  const [position, setPosition] = useState({ top: 0, left: 0 }); // Position state
  

  useEffect(() => {
    const elmnt = mydivRef.current;
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

    const headerElement = elmnt.querySelector("#mydivheader");
    if (headerElement) {
      headerElement.onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }

    return () => {
      if (headerElement) {
        headerElement.onmousedown = null;
      } else {
        elmnt.onmousedown = null;
      }
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }, []);

  return (
    <>
      <div
        id="mydiv"
        ref={mydivRef}
        style={{ position: 'absolute', top: `${position.top}px`, left: `${position.left}px`, cursor: 'move' }}
      >
      <PopupContent/>
      </div>
    </>
  );
}

export default PopupDrag;
