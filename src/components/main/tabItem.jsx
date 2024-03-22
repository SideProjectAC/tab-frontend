import { DeleteItemFromGroupAPI } from "../../api/itemAPI";
import { useGroups } from "./groupContext"

const TabItem = ({tab, groupId}) => {

 const { setGroups} = useGroups()


  const activateTab = async () => {
    await chrome.tabs.create({ url: tab.browserTab_url, active: false });
    await chrome.windows.update(tab.windowId, { focused: true });
  }; 


  function getFaviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "32");
    return url.toString();
  }
  const favIconUrl = getFaviconURL(tab.browserTab_url)

  async function handleDeleteTab(groupId) {
    setGroups(prev => prev.map(group => {
      if (group.group_id === groupId) {
        return { ...group, items: group.items.filter(item => item.item_id !== tab.item_id) };
      }
      return group;
    }));

    try {
      await DeleteItemFromGroupAPI(groupId, tab.item_id);
    } catch (error) {
      console.error(error);
    }
  } 

  return (
    <a onClick={activateTab}> 
      <li className="tabItem">
        <img src={favIconUrl} alt="Favicon" className="tabIcon"/>
        <div className="tabText">
          <h3>{tab.browserTab_title}</h3>
          <p>{tab.browserTab_url}</p>
        </div>
        <button className="deleteButton"
          onClick={() => handleDeleteTab(groupId)}>x</button>
      </li>
    </a>
  );
}

export default TabItem