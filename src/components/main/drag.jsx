import { useState, useEffect } from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'
import {fetchGroupsAPI} from '../../api/groupAPI';
import { PostTabAPI,DeleteItemFromGroupAPI } from '../../api/itemAPI';


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
        console.log("set group:", originGroupId)
        e.dataTransfer.setData("itemId", itemId.toString());
        e.dataTransfer.setData("originGroupId", originGroupId);
        console.log("get group:", e.dataTransfer.getData("originGroupId"))
        e.dataTransfer.effectAllowed = 'move';
    };
    
    
    const handleDrop = (e, targetGroupId, newGroups) => {
        e.preventDefault();
        const itemId = parseInt(e.dataTransfer.getData("itemId"), 10);
        const originGroupId = e.dataTransfer.getData("originGroupId")
        console.log("get group:", e.dataTransfer.getData("originGroupId"))

        let originGroupIndex
        // if (newGroups !== undefined) {
        //     originGroupIndex = newGroups.findIndex(group => group.group_id === originGroupId);
        // }
        originGroupIndex = groups.findIndex(group => {
            console.log(group.group_id, originGroupId)
            return group.group_id === originGroupId
        });
        if (originGroupId === targetGroupId) return; 
        console.log('originGroupId',originGroupId)
        console.log('target group id: ',targetGroupId)

        let draggedTab;
//先刪除原本在的地方
         if (originGroupId === 'ActiveTabs') {
            draggedTab = activeTabs.find(item => item.id === itemId);
            setActiveTabs(prev => prev.filter(item => item.id !== itemId));
            closeTab(draggedTab.id)
        } else {
            draggedTab = groups[originGroupIndex].items.find(item => item.id === itemId);
            setGroups(prev => prev.map(group => {
                if (group.group_id === originGroupId) {
                return { ...group, items: group.items.filter(item => item.id !== itemId) };
                }
                return group;
            }));

            //delete API
            (async () => {
                try {
                    const item_id = draggedTab.item_id
                    console.log('item_id',item_id)
                    const data = await DeleteItemFromGroupAPI(originGroupId, item_id);
                    console.log('Deletion confirmation API:',data);
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
                    const data = await PostTabAPI(targetGroupId, newTabData);
                    console.log('newTab data API:', data);
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
