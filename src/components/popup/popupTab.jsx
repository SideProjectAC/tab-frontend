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
      <li className="popup-tabItem">
        <img src={favIconUrl} alt="Favicon" className="popup-tabIcon" />
        <div>
          <h3 className="popup-tabTitle">{currentTab.title}</h3>
          <p className="popup-tabUrl">{currentTab.url}</p>
        </div>
      </li>
    </a>
  );
}

export default Tab;
