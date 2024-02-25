import '../styles/tabItem.css'

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
     <li>
      <a onClick={activateTab}>
        <img src={favIconUrl} alt="Favicon" />
        <h3 className="title">{tab.title}</h3>
        <p className="pathname">{tab.url}</p>
      </a>
    </li>
  );
}

export default TabItem