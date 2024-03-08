import { useState, useEffect, useRef } from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'
import {fetchGroupsAPI} from '../../api/groupAPI';
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
    
    
    
    function handleFetch() {
        const fetchData = async () => {
            const response = await fetchGroupsAPI();
            console.log('Groups fetched: ', response.data);
        }
        fetchData()
        console.log('frontEnd groups',groups)
     
    }

    useEffect(() => {
        setActiveTabs(chromeTabs)
    },[chromeTabs])


    const handleDragStart = (e, itemId, originGroupId) => {
        e.dataTransfer.setData("itemId", itemId);
        e.dataTransfer.setData("originGroupId", originGroupId);
        originGroupIdRef.current = originGroupId;
        // itemIdRef.current = itemId;
        e.dataTransfer.effectAllowed = 'move';
        console.log('startCalled',itemId,originGroupId)
    };
    
    
    const handleDrop = async (e, targetGroupId) => {
        e.preventDefault();
        const tabId = parseInt(e.dataTransfer.getData("itemId"), 10);
        const originGroupId = originGroupIdRef.current;
        const originGroupIndex = groups.findIndex(group => group.group_id === originGroupId );
        const itemId = groups[originGroupIndex].items.find(item => item.item_id === tabId);
        
        if (originGroupId === targetGroupId) return; 

        let draggedTab;
//先刪除原本在的地方
         if (originGroupId === 'ActiveTabs') {
            draggedTab = activeTabs.find(item => item.item_id === itemId);
            setActiveTabs(prev => prev.filter(item => item.item_id !== itemId));
            closeTab(draggedTab.id)
        } else {
            draggedTab = groups[originGroupIndex].items.find(item => item.item_id === itemId);
            
            //delete API
            (async () => {
                try {
                    const item_id = draggedTab.item_id
                    const data = await DeleteItemFromGroupAPI(originGroupId, item_id);
                    // console.log('Deletion confirmation API:',data);
                    setGroups(prev => prev.map(group => {
                        if (group.group_id === originGroupId) {
                        return { ...group, items: group.items.filter(item => item.item_id !== itemId) };
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
            setActiveTabs(prev => [...prev, draggedTab]);
            openTab(draggedTab.url)
            return
        } else {

            //API
            (async () => {
                const newTabData = {
                    browserTab_favIconURL: draggedTab.favIconUrl,
                    browserTab_title: draggedTab.title,
                    browserTab_url: draggedTab.url,
                    targetItem_position: 0
                };
                try {
                    console.log(`${itemId} from ${originGroupId} to ${targetGroupId}`)
                    
                    const targetGroup = groups.find(group => group.group_id === targetGroupId)

                    //setTimeout for adding to new group
                    if (targetGroup == undefined) {
                        setTimeout(async () => {
                           const data = await PostTabAPI(targetGroupId, newTabData);
                            const newDraggedTab = { ...draggedTab, item_id: data.item_id };
                            setGroups(prev => prev.map(group => {
                                if (group.group_id === targetGroupId) {
                                    return { ...group, items: [...group.items, newDraggedTab] };
                                }
                            return group;
                            }));
                        }, 800); 
                        return
                    }

                    //no setTimeout for adding to existing group
                    const data = await PostTabAPI(targetGroupId, newTabData);
                    const newDraggedTab = { ...draggedTab, item_id: data.item_id };
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
