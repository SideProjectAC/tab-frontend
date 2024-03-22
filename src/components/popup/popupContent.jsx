import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faList, faPalette, faMapPin, faXmark } from '@fortawesome/free-solid-svg-icons';
import { popupContentPropTypes} from '../main/propTypes';
Tab.propTypes = popupContentPropTypes;

function Tab({ currentTab }) {
  function getFaviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    return url.toString();
  }

  const favIconUrl = getFaviconURL(currentTab.url);

  return (
    <a>  
      <li className="tabItem">
        <img src={favIconUrl} alt="Favicon" className="tabIcon"/>
        <div>
          <h3 className="tabTitle">{currentTab.title}</h3>
          <p className="tabUrl">{currentTab.url}</p>
        </div>
      </li>
    </a>
  );
}

function PopupContent() {
  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      setCurrentTab(activeTab);
      console.log('currentTab popup', currentTab);
    });
  }, [currentTab]); 

  return (
    <>
      <div id="header">
        <p>Click here to move</p>
        <FontAwesomeIcon icon={faXmark} className='button'/>
      </div>
      
      {currentTab && <Tab currentTab={currentTab} />}
      
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

export default PopupContent;
