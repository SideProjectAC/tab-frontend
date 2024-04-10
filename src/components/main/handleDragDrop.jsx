 import { useRef } from 'react';
 import {DeleteItemFromGroupAPI,PatchItemToExistingGroupsAPI, PostTabAPI} from '../../api/itemAPI';  
 import {postNewGroupAPI} from '../../api/groupAPI';
   
export const useDragDrop = (activeTabs, groups, setGroups, setActiveTabs) => {
  const originGroupIdRef = useRef();
  const itemIdRef = useRef();

  const handleDragStart = (e, itemId, originGroupId) => {
    e.dataTransfer.setData("itemId", itemId);
    e.dataTransfer.setData("originGroupId", originGroupId);
    originGroupIdRef.current = originGroupId;
    itemIdRef.current = itemId;
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = async (e, targetGroupId) => {
    e.preventDefault();
    const originGroupId = originGroupIdRef.current;
    const itemId = itemIdRef.current;
    const originGroupIndex = groups.findIndex(group => group.group_id === originGroupId );
    
    if (originGroupId === targetGroupId) return; 

    let draggedItem;
    //前端先刪除原本在的地方
    if (originGroupId === 'ActiveTabs') {
      draggedItem = activeTabs.find(tab => tab.browserTab_id === itemId);
      setActiveTabs(prev => prev.filter(tab => tab.browserTab_id !== itemId));
      closeTab(draggedItem.browserTab_id)
    } else {
      draggedItem = groups[originGroupIndex].items.find(item => item.item_id === itemId);
      updateGroupItems(originGroupId, items => items.filter(item => item.item_id !== itemId));
    }

    //新增到新的地方
    if (targetGroupId === 'ActiveTabs') {
      await DeleteItemFromGroupAPI(originGroupId, itemId);
      setActiveTabs(prev => [...prev, draggedItem]);
      openTab(draggedItem.browserTab_url)
      return
    } else {
      const targetGroup = groups.find(group => group.group_id === targetGroupId)
      await handleGroupTransfer(draggedItem, originGroupId, targetGroupId, targetGroup, itemId);
    }
  };

  const handleGroupTransfer = async (draggedItem, originGroupId, targetGroupId, targetGroup, itemId) => {
    try {
        //從ActiveTabs拉到newGroup區域: 後端給新GroupID 和 ItemID
      if (targetGroupId.current === null && originGroupId === 'ActiveTabs') {
          const newGroupTabData = {
            browserTab_favIconURL: draggedItem.browserTab_favIconURL,
            browserTab_title: draggedItem.browserTab_title,
            browserTab_url: draggedItem.browserTab_url,
            browserTab_id: draggedItem.browserTab_id,
            browserTab_index: draggedItem.browserTab_index,
            browserTab_active: draggedItem.browserTab_active,
            browserTab_status: draggedItem.browserTab_status,
            windowId: draggedItem.windowId,
            group_icon: randomEmoji(),
            group_title:"Untitled",
          };
          console.log('debug',newGroupTabData) //4/9 debug
          const response = await postNewGroupAPI(newGroupTabData);
          const newGroup = {
            group_icon: newGroupTabData.group_icon,
            group_title: newGroupTabData.group_title,
            group_id: response.data.group_id,   
            items: [{...newGroupTabData, item_id: response.data.item_id}]
          };
          updateGroups(newGroup);
          return
      }
        //從已從在的group拉到newGroup區域: 後端給新GroupID 但沿用原ItemID
      if(targetGroupId.current === null && originGroupId !== 'ActiveTabs') {
        const tabData = {
          sourceGroup_id: originGroupId,
          item_id: itemId,
          group_title:"Untitled",
          group_icon: randomEmoji()
        }
        const response = await postNewGroupAPI(tabData);
        const newGroup = {
          group_icon: tabData.group_icon,
          group_title:tabData.group_title,
          group_id: response.data.group_id,   
          items: [{...draggedItem}]
        };
        updateGroups(newGroup);
        return
      }
        // 從ActiveTabs拉到已存在的group,使用post新增該item
      if(targetGroupId !== undefined && originGroupId === 'ActiveTabs') {
        const tabData = {
          browserTab_favIconURL: draggedItem.browserTab_favIconURL,
          browserTab_title: draggedItem.browserTab_title,
          browserTab_url: draggedItem.browserTab_url,
          browserTab_id: draggedItem.browserTab_id,
          browserTab_index: draggedItem.browserTab_index,
          browserTab_active: draggedItem.browserTab_active,
          browserTab_status: draggedItem.browserTab_status,
          windowId: draggedItem.windowId,
          targetItem_position: targetGroup.items.length,
        }
        const response = await PostTabAPI(targetGroupId, tabData);
        const newDraggedTab = { ...draggedItem, item_id: response.item_id };
        updateGroupItems(targetGroupId, items => [...items, newDraggedTab]);
        return
      }
        //拉到已存在的group,使用patch移動該item
      if(targetGroupId !== undefined && originGroupId !== 'ActiveTabs') {
        const targetPosition = { 
          targetItem_position: targetGroup.items.length,
          targetGroup_id: targetGroupId
        };
        await PatchItemToExistingGroupsAPI(originGroupId, itemId, targetPosition);
        const newDraggedTab = { ...draggedItem, item_id: itemId };
        updateGroupItems(targetGroupId, items => [...items, newDraggedTab]);
        return
      }
    } catch (error) {
      console.error(error);
    }
  };


  //更新前端Groups（當有newGroup被新增時）
  const updateGroups = (newGroup) => {
    setGroups(prevGroups => {
      const updatedGroups = [...prevGroups, newGroup];  
      return updatedGroups;
    });
  }

  //更新前端Group裡的items  
  const updateGroupItems = (groupId, updateFunction) => {
    setGroups(prev => prev.map(group => 
      group.group_id === groupId ? { ...group, items: updateFunction(group.items) } : group));
  };


  const randomEmoji = () => {
      const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"];
      return  emojiList[Math.floor(Math.random() * emojiList.length)];
  }

  // 從ActiveTabs拉進groups 的tab 會先關閉  
  function closeTab(tabId) {
    chrome.tabs.remove(tabId);
  }

  // 從groups 再次拉進ActiveTabs 會再次打開  
  function openTab(url) {
      chrome.tabs.create({url:url, active: false })
  }

  //debug用:單純新增一個group，之後會刪除
  const handleAddGroup = async () => {
    const newGroupData = {group_icon: randomEmoji(), group_title: "Untitled"}
    const response = await postNewGroupAPI(newGroupData);
    const newGroup = {
      group_id: response.data.group_id, 
      group_icon: newGroupData.group_icon, 
      group_title: newGroupData.group_title, 
      items: []
    };
    updateGroups(newGroup);
  }


  return { handleDragStart, handleDragOver, handleDrop,  handleAddGroup };
}