

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
    <a onClick={activateTab}> 
      <li className="activeItem">
        <img src={getFaviconURL(item.browserTab_url)} alt="Favicon" className="activeIcon"/>
        <h6 className="activeTabTitle">{item.browserTab_title}</h6>
        <button className="deleteButton"
          onClick={() => handleDeleteTab(item.browserTab_id)}>x
        </button>
      </li>
    </a>
  )

}

function ActiveTabs({activeTabs , handleDrop, handleDragStart, handleDragOver }) {

    return(
    <div className='activeList'
      onDrop={(e) => handleDrop(e, 'ActiveTabs')} 
      onDragOver={(e) => handleDragOver(e)}
    >
      <h1 className="activeTitle">Active Tabs</h1>
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
  )
}

export default ActiveTabs