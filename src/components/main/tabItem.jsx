import { deleteItemFromGroupAPI } from "../../api/itemAPI";
import { useGroups } from "../useContext/GroupContext";
import { tabItemPropTypes } from "./PropTypes";
import "../../scss/main/item.scss";

const TabItem = ({ tab, groupId, className }) => {
  const { setGroups } = useGroups();

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
  const favIconUrl = getFaviconURL(tab.browserTab_url);

  async function handleDeleteTab(groupId) {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.group_id === groupId) {
          return {
            ...group,
            items: group.items.filter((gitem) => gitem.item_id !== tab.item_id),
          };
        }
        return group;
      })
    );

    try {
      await deleteItemFromGroupAPI(groupId, tab.item_id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <a onClick={activateTab}>
      <li className={className ? `tabItem ${className}` : "tabItem"}>
        <img src={favIconUrl} alt="Favicon" className="tabIcon" />
        <div className="tabText">
          <h3>{tab.browserTab_title}</h3>
          <p>{tab.browserTab_url}</p>
        </div>
        <button
          className="deleteButton"
          onClick={(event) => {
            event.stopPropagation();
            handleDeleteTab(groupId);
          }}
        >
          x
        </button>
      </li>
    </a>
  );
};
TabItem.propTypes = tabItemPropTypes;
export default TabItem;
