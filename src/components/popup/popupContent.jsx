import { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleHalfStroke, faList, faPalette, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ThemeContext } from '../main/themeContext';
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

  const {theme, setTheme} = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'))   
    }

  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      setCurrentTab(activeTab);
      console.log('currentTab popup', currentTab);
    });

    document.documentElement.setAttribute('data-theme', theme);
  }, [currentTab, theme]); 

  return (
    <>
      <div id="header">
        <p>Click here to move</p>
        <FontAwesomeIcon icon={faXmark} 
          className='button delete'
          onClick={() => window.close()}
        />
      </div>
      
      {currentTab && <Tab currentTab={currentTab} />}
      
      <form>
        <textarea placeholder='New note'></textarea>
      </form>
      <div className='buttons'>
        <FontAwesomeIcon icon={faCircleHalfStroke} 
          className='button theme'
          onClick={toggleTheme}
         />
        <FontAwesomeIcon icon={faList} className='button todo' />
        <FontAwesomeIcon icon={faPalette} className='button color' />
        <button className='button save'>Save</button>
      </div>
    </>
  );
}

export default PopupContent;
