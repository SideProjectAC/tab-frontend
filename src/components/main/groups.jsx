import { useGroups } from "./groupContext"
import { useEffect,useRef } from 'react';
import Group from "./group";
import { postNewGroupAPI,deleteGroupAPI } from "../../api/groupAPI";

function Groups ({
  handleDrop,
  handleDragOver,
  handleDragStart}) {

  const {groups, setGroups} = useGroups()

  const newGroupId = useRef(null);

  const getDraggedItem = (e) => {
    const itemId = e.dataTransfer.getData("itemId");
    const originGroupId = e.dataTransfer.getData("originGroupId");
    const originGroupIndex = groups.findIndex(group => group.group_id === originGroupId );
    let draggedTab;
    if (originGroupId === 'ActiveTabs') {
      draggedTab = activeTabs.find(item => item.item_id === itemId);
    } else {
      draggedTab = groups[originGroupIndex].items.find(item => item.item_id === itemId);
      console.log('draggedTab from getDraggedItem',draggedTab)
     return draggedTab 
    }

  const handleAddGroup = async (tab) => {
    const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"];
    const tempEmoji = emojiList[Math.floor(Math.random() * emojiList.length)];

    try {

      const tabData = {
        "browserTab_favIconURL": tab.favIconUrl,
        "browserTab_title": tab.title,
        "browserTab_url": tab.url,
        "group_icon": tempEmoji,
        "group_title": "Untitled"
      }

      const response = await postNewGroupAPI(tabData);
      console.log('API post newGroup response', response.data);
      
      if(!response.data.group_id) return console.error('error in adding group')

       const newGroup = {
        group_id: response.data.group_id, 
        group_icon: tempEmoji, 
        group_title: "Untitled", 
        items: [{
          item_id: response.data.item_id, 
          browserTab_favIconURL: tab.favIconUrl, 
          browserTab_title: tab.title, 
          browserTab_url: tab.url,
          targetItem_position: 0}]
      };
      
      
      setGroups(prevGroups => {
        const updatedGroups = [...prevGroups, newGroup];
        return updatedGroups;
      });

      newGroupId.current = response.data.group_id;
      return { newGroupId: response.data.group_id, newGroups: [...groups, newGroup] };
    } catch (error) {
      console.error('error in adding group', error);
      return { newGroupId: undefined, newGroups: groups };
    }
    
  };




  async function handleDeleteGroup (groupId)  {
    try {
      await deleteGroupAPI(groupId);
      console.log('Group deleted successfully');

      setGroups(prev => prev.filter(group => group.group_id !== groupId))
    } catch (error) {
      console.error('Error deleting group', error);
    }
    
  }
 
  const handleSiteCount = (groupId) => {
    const group = groups.find(g => g.group_id === groupId);
    if (group) {
      group.items.forEach(item => {
        chrome.tabs.create({ url: item.url, active: false });
      });
    } else {
      console.error('Group not found:', groupId);
    }
  };

  

  return (
    <>
      <div className='groups'>
        {groups.map(group => (
          <Group
          key={group.group_id}
          group={group}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          handleSiteCount={handleSiteCount}
          handleDeleteGroup={handleDeleteGroup}
          handleDragOver={handleDragOver}

        />
        ))}
      </div>
        <div className='newGroup'
          onDragOver={handleDragOver}
          onDrop={async (e) => {
            e.preventDefault();
            const tab = getDraggedItem(e);
            const {newGroupId} = await handleAddGroup(tab);
            handleDrop(e, newGroupId);
          }} 
        ></div>
      {/* <button onClick={handleAddGroup}>addGroup</button> */}
``    </>
  )
}
}

export default Groups