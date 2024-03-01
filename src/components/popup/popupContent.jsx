import { useState, useEffect } from 'react';
import TabItem from '../main/tabItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faList, faPalette, faMapPin, faXmark } from '@fortawesome/free-solid-svg-icons';


function PopupContent() {
  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      setCurrentTab(activeTab); 
    });
  }, []); 


  return (
    <>
      <div id="header">
        <p>Click here to move</p>
        <FontAwesomeIcon icon={faXmark} className='button'/>
      </div>
      {currentTab && <TabItem tab={currentTab} />}
      <form>
        <textarea placeholder='New note'></textarea>
      </form>
      <div className='buttons'>
        <FontAwesomeIcon icon={faCircleHalfStroke} className='button' />
        <FontAwesomeIcon icon={faList} className='button' />
        <FontAwesomeIcon icon={faPalette} className='button' />
        <FontAwesomeIcon icon={faMapPin} className='button' />
        <button className='button'>Save</button>
      </div>
    </>
  );
}
export default PopupContent