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
                    const data = await DeleteItemFromGroupAPI(originGroupId, draggedItem.item_id);
                    console.log('API tab deleted.',data)
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

            //API
            (async () => {
                console.log('hihi')
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
                console.log('newTabData',newTabData)
                try {
                    console.log(`${itemId} from ${originGroupId} to ${targetGroupId}`)
                    
                    const targetGroup = groups.find(group => group.group_id === targetGroupId)

                    console.log('targetGroup',targetGroup)

                    //setTimeout for adding to new group
                    //從group拉tab到newGroup bug: 要改api ，同時加group &id

                    if (targetGroup == undefined) {
                        setTimeout(async () => {
                           const data = await PostTabAPI(targetGroupId, newTabData);
                            const newDraggedTab = { ...draggedItem, item_id: data.item_id }; 
                            setGroups(prev => prev.map(group => {
                                if (group.group_id === targetGroupId) {
                                    return { ...group, items: [...group.items, newDraggedTab] };
                                }
                            return group;
                            }));
                        }, 1000); 
                        return
                    }

                    //no setTimeout for adding to existing group
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
