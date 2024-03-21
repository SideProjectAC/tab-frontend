import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function ActiveTabItem(item) {

  function handleDeleteTab(tabId) {
    chrome.tabs.remove(tabId);
  }

  function getFaviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    return url.toString();
  }

  const activateTab = async () => {
    await chrome.tabs.update(item.browserTab_id, { active: true });
  }; 

  
  return (
    <a> 
      <li className="activeItem">
        <img src={getFaviconURL(item.browserTab_url)} alt="Favicon" className="activeIcon" onClick={activateTab}/>
        <h6 className="activeTabTitle" onClick={activateTab}>{item.browserTab_title}</h6>
        <button className="deleteButton"
          onClick={() => handleDeleteTab(item.browserTab_id)}>x
        </button>
      </li>
    </a>
  )

}

function ActiveTabs({activeTabs , handleDrop, handleDragStart, handleDragOver }) {

  const [isPinned, setIsPinned] = useState(true);

   const handlePin = () => {
    setIsPinned(!isPinned);
  };

  return(
    <div className='activeWrapper' draggable>
      <div className={` ${isPinned ? 'activeTitleWrapper' : 'activeTitleWrapperUnpinned'}`} onClick={handlePin}>
        <FontAwesomeIcon icon={faMapPin}  className={` ${isPinned ? 'pinActive' : 'pinActiveUnpinned'}`}/>
        <h1 className={` ${isPinned ? 'activeTitle' : 'activeTitleUnpinned'}`}>Active Tabs </h1>
      </div>
      <div className={`activeList ${isPinned ? 'pinned' : ''}`}
        onDrop={(e) => handleDrop(e, 'ActiveTabs')} 
        onDragOver={(e) => handleDragOver(e)}
      >
      {activeTabs.map((item) => (
        <div className='activeTab'
          key={item.browserTab_id}
          draggable
          onDragStart={(e) => handleDragStart(e, item.browserTab_id, 'ActiveTabs')}
        >
          <ActiveTabItem {...item} />
        </div>
      ))}
    </div>
    </div>
  )
}

export default ActiveTabs