import { useState, useEffect, useRef } from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'
import {fetchGroupsAPI,postNewGroupAPI} from '../../api/groupAPI';
import { PostTabAPI,DeleteItemFromGroupAPI} from '../../api/itemAPI';


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
            //delete API
            (async () => {
                try {
                    const response = await DeleteItemFromGroupAPI(originGroupId, draggedItem.item_id);
                    console.log('API tab deleted.',response.data)
                    setGroups(prev => prev.map(group => {
                        if (group.group_id === originGroupId) {
                        return { ...group, items: group.items.filter(item => item.item_id !== draggedItem.item_id) };
                        }
                        return group;
                    }));
                } catch (error) {
                    console.error(error);
                }
            })();

        }

//新增到新的地方
        if (targetGroupId === 'ActiveTabs') {
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
                    // targetItem_position: 0 //後端ＡＰＩ少了這項 但暫時不會用到
                    group_icon:"⚠️",
                    group_title:"Untitled",
                };
                try {
                    console.log(`${itemId} from ${originGroupId} to ${targetGroupId}`)
                    const targetGroup = groups.find(group => group.group_id === targetGroupId)

                    //拉到newGroup區域，直接新增group並將draggedItem加入該group
                    if (targetGroup == undefined) {
                        const response = await postNewGroupAPI(newGroupTabData);
                        console.log('API newGroup response', response.data);
                        const newGroup = {
                            group_id: response.data.group_id,   
                            items: [{...newGroupTabData, item_id: response.data.item_id}]
                        };
                        setGroups(prevGroups => {
                            const updatedGroups = [...prevGroups, newGroup];  
                            return updatedGroups;
                        });
                    return
                    }
                    //拉到已存在的group
                    const newTabData = {
                        browserTab_favIconURL: draggedItem.browserTab_favIconURL,
                        browserTab_title: draggedItem.browserTab_title,
                        browserTab_url: draggedItem.browserTab_url,
                        browserTab_id: draggedItem.browserTab_id,
                        browserTab_index: draggedItem.browserTab_index,
                        browserTab_active: draggedItem.browserTab_active,
                        browserTab_status: draggedItem.browserTab_status,
                        windowId: draggedItem.windowId,
                        targetItem_position: 0 
                    };

                    const data = await PostTabAPI(targetGroupId, newTabData);
                    const newDraggedTab = { ...draggedItem, item_id: data.item_id };
                    setGroups(prev => prev.map(group => {
                        if (group.group_id === targetGroupId) {
                            return { ...group, items: [...group.items, newDraggedTab] };
                        }
                    return group;
                    }));

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
