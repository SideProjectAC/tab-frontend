// import '../../styles/main/tabItem.css'

const TabItem = ({tab}) => {

   const activateTab = async () => {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  };


  function getFaviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    return url.toString();
  }

  const favIconUrl = getFaviconURL(tab.url)

  return (
    <a onClick={activateTab}>
      <li className="tabItem">
        <img src={favIconUrl} alt="Favicon" className="tabIcon"/>
        <div>
          <h3 className="tabTitle">{tab.title}</h3>
          <p className="tabUrl">{tab.url}</p>
        </div>
      </li>
    </a>
  );
}

export default TabItem