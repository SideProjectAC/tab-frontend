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

  const favIconUrl = getFaviconURL(tab.url)

  function handleDeleteTab(groupId) {

    if (groupId === 'ActiveTabs'){
      chrome.tabs.remove(tab.id);
      return
    }
   setGroups(prev => prev.map(group => {
        if (group.group_id === groupId) {
        return { ...group, items: group.items.filter(item => item.item_id !== tab.id) };
        }
        return group;
    }));

    (async () => {
        try {
          const item_id = tab.item_id
          console.log('item_id',item_id)
          const data = await DeleteItemFromGroupAPI(groupId, item_id);
          // console.log('tab Deletion confirmation API:',data);
        } catch (error) {
          console.error(error);
        }
      })();

  }

  return (
    <a href={tab.url} target="_blank" rel="noopener noreferrer">
      <li className="tabItem">
        <img src={favIconUrl} alt="Favicon" className="tabIcon"/>
        <div>
          <h3 className="tabTitle">{tab.title}</h3>
          <p className="tabUrl">{tab.url}</p>
        </div>
        <button className="deleteButton"
          onClick={() => handleDeleteTab(groupId)}>x</button>
      </li>
    </a>
  );
}

export default TabItem