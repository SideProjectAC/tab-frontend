// import '../../styles/main/tabItem.css'
import { DeleteItemFromGroupAPI } from "../../api/itemAPI";
import { useGroups } from "./groupContext"

const TabItem = ({tab, groupId}) => {

 const { setGroups} = useGroups()

  //TODO: bug!!
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

  const favIconUrl = getFaviconURL(tab.browserTab_url)

  function handleDeleteTab(groupId) {

    if (groupId === 'ActiveTabs'){
      chrome.tabs.remove(tab.browserTab_id);
      return
    }
   setGroups(prev => prev.map(group => {
        if (group.group_id === groupId) {
        return { ...group, items: group.items.filter(item => item.item_id !== tab.item_id) };
        }
        return group;
    }));

    (async () => {
        try {
          const data = await DeleteItemFromGroupAPI(groupId, tab.item_id);
          console.log('tab Deletion confirmation API:',data);
        } catch (error) {
          console.error(error);
        }
      })();

  }

  return (
    // <a href={tab.browserTab_url} target="_blank" rel="noopener noreferrer">
    <a>
      <li className="tabItem">
        <img src={favIconUrl} alt="Favicon" className="tabIcon"/>
        <div>
          <h3 className="tabTitle">{tab.browserTab_title}</h3>
          <p className="tabUrl">{tab.browserTab_url}</p>
        </div>
        <button className="deleteButton"
          onClick={() => handleDeleteTab(groupId)}>x</button>
      </li>
    </a>
  );
}

export default TabItem