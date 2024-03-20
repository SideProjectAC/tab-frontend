import { useState, useEffect, useRef } from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'
import {fetchGroupsAPI,postNewGroupAPI} from '../../api/groupAPI';
import {DeleteItemFromGroupAPI,PatchItemToExistingGroupsAPI, PostTabAPI} from '../../api/itemAPI';


function closeTab(tabId) {
  chrome.tabs.remove(tabId);
}

function openTab(url) {
    chrome.tabs.create({url:url, active: false })
}

function DragDropComponent() {
    const [activeTabs, setActiveTabs] = useState([]);
    const {groups , setGroups} = useGroups()
    const {chromeTabs} = useChromeTabs()
    const originGroupIdRef = useRef();
    const itemIdRef = useRef();
    
    
    //這只是debug用
    function handleFetch() {
        const fetchData = async () => {
            const response = await fetchGroupsAPI();
            console.log('Groups fetched from Backend: ', response.data);
        }
        fetchData()
        console.log('frontEnd groups',groups)
        console.log('activeTabs',activeTabs)
     
    }

    useEffect(() => {
        setActiveTabs(chromeTabs)
    },[chromeTabs])


    const handleDragStart = (e, itemId, originGroupId) => {
        e.dataTransfer.setData("itemId", itemId);
        e.dataTransfer.setData("originGroupId", originGroupId);
        originGroupIdRef.current = originGroupId;
        itemIdRef.current = itemId;
        e.dataTransfer.effectAllowed = 'move';
    };
    
    
    const handleDrop = async (e, targetGroupId) => {
        e.preventDefault();
        const originGroupId = originGroupIdRef.current;
        const itemId = itemIdRef.current;
        const originGroupIndex = groups.findIndex(group => group.group_id === originGroupId );
        
        if (originGroupId === targetGroupId) return; 

        let draggedItem;
//先刪除原本在的地方
         if (originGroupId === 'ActiveTabs') {
            draggedItem = activeTabs.find(tab => tab.browserTab_id === itemId);
            setActiveTabs(prev => prev.filter(tab => tab.browserTab_id !== itemId));
            closeTab(draggedItem.browserTab_id)
        } else {
            draggedItem = groups[originGroupIndex].items.find(item => item.item_id === itemId);
            //只有前端要刪除，後端用patch API 不用另外delete
            setGroups(prev => prev.map(group => {
                if (group.group_id === originGroupId) {
                return { ...group, items: group.items.filter(item => item.item_id !== draggedItem.item_id) };
                }
                return group;
            }));       
        }

//新增到新的地方
        if (targetGroupId === 'ActiveTabs') {
            const response = await DeleteItemFromGroupAPI(originGroupId, itemId);
            console.log('Item deleted successfully:', response.data);
            setActiveTabs(prev => [...prev, draggedItem]);
            openTab(draggedItem.browserTab_url)
            return
        } else {

            //這邊API跟程式碼都比較重複，待優化！
            (async () => {
                const newGroupTabData = {
                    browserTab_favIconURL: draggedItem.browserTab_favIconURL,
                    browserTab_title: draggedItem.browserTab_title,
                    browserTab_url: draggedItem.browserTab_url,
                    browserTab_id: draggedItem.browserTab_id,
                    browserTab_index: draggedItem.browserTab_index,
                    browserTab_active: draggedItem.browserTab_active,
                    browserTab_status: draggedItem.browserTab_status,
                    windowId: draggedItem.windowId,
                    // targetItem_position: 0 //後端ＡＰＩ少了這項 但暫時不會用到？
                    group_icon:randomEmoji(),
                    group_title:"Untitled",
                };
                try {
                    console.log(`item ID: ${itemId} from ${originGroupId} to ${targetGroupId}`)
                    const targetGroup = groups.find(group => group.group_id === targetGroupId)

                    //從ActiveTabs拉到newGroup區域，後端會給新itemID
                    if (targetGroup === undefined && originGroupId === 'ActiveTabs') {
                        const response = await postNewGroupAPI(newGroupTabData);
                        const newGroup = {
                            group_icon:newGroupTabData.group_icon,
                            group_title:newGroupTabData.group_title,
                            group_id: response.data.group_id,   
                            items: [{...newGroupTabData, item_id: response.data.item_id}]
                        };
                        setGroups(prevGroups => {
                            const updatedGroups = [...prevGroups, newGroup];  
                            return updatedGroups;
                        });
                    return
                    }

                    //從已從在的group拉到newGroup區域，沿用原itemID
                    if(targetGroup == undefined && originGroupId !== 'ActiveTabs') {
                        const tabData = {
                            sourceGroup_id: originGroupId,
                            item_id: itemId,
                            group_icon:randomEmoji(),
                        }
                        const response = await postNewGroupAPI(tabData);
                        const newGroup = {
                            group_icon:tabData.group_icon,
                            group_title:"Untitled",
                            group_id: response.data.group_id,   //新的group所以拿後端給的ID
                            items: [{...newGroupTabData, item_id: itemId}]
                        };
                        setGroups(prevGroups => {
                            const updatedGroups = [...prevGroups, newGroup];  
                            return updatedGroups;
                        });
                    return
                    }
                    // 從ActiveTabs拉到已存在的group,使用post新增該item
                    if (targetGroupId !== undefined && originGroupId === 'ActiveTabs') {
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
                        console.log('New tab added to existing Group :', response);
                         const newDraggedTab = { ...draggedItem, item_id: response.item_id };
                        //前端也新增
                        setGroups(prev => prev.map(group => {
                            if (group.group_id === targetGroupId) {
                                return { ...group, items: [...group.items, newDraggedTab] };
                            }
                        return group;
                        }));
                    }
                    //拉到已存在的group,使用patch移動該item
                    if (targetGroupId !== undefined && originGroupId !== 'ActiveTabs') {
                        const targetPosition = { 
                            targetItem_position: targetGroup.items.length,
                            targetGroup_id: targetGroupId
                        };
                        const data = await PatchItemToExistingGroupsAPI(originGroupId, itemId, targetPosition);
                        const newDraggedTab = { ...draggedItem, item_id: data.item_id };
                        //前端也新增
                        setGroups(prev => prev.map(group => {
                            if (group.group_id === targetGroupId) {
                                return { ...group, items: [...group.items, newDraggedTab] };
                            }
                        return group;
                        }));
                    }
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    };
    

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

       
    const randomEmoji = () => {
        const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"];
        return emojiList[Math.floor(Math.random() * emojiList.length)];
    }
    

    return (
    <>
        <div className='wrapper'>
            <ActiveTabs
                activeTabs={activeTabs}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
            />
            <Groups
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
            />
        </div>
        <button onClick={() => handleFetch()} > fetch Data</button>
    </>
    );
}

export default DragDropComponent;
