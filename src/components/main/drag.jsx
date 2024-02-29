import { useEffect, useState } from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'

function closeTab(tabId) {
  chrome.tabs.remove(tabId);
}

function openTab(url) {
    chrome.tabs.create({url:url, active: false })
}

function DragDropComponent() {
    const {groups , setGroups} = useGroups()
    const {chromeTabs} = useChromeTabs()
    const [activeTabs, setActiveTabs] = useState([]);
    const newGroupId = groups.length + 1; 


    useEffect(() => {
        setActiveTabs(chromeTabs)
    },[chromeTabs])


    const handleDragStart = (e, itemId, originGroupId) => {
        e.dataTransfer.setData("itemId", itemId);
        e.dataTransfer.setData("originGroupId",originGroupId);
        e.dataTransfer.effectAllowed = 'move';
    };


    const handleDrop = (e, targetGroupId) => {
        e.preventDefault();
        const itemId = parseInt(e.dataTransfer.getData("itemId"), 10);
        const originGroupId =  parseInt(e.dataTransfer.getData("originGroupId"), 10);

        if (originGroupId === targetGroupId) return; 

        // Moving item from one zone to another (or back to the original list)
        let draggedTab;
        let originGroupIndex;

// 先刪除原本的位置
        if (originGroupId === 0) {
            draggedTab = activeTabs.find(item => item.id === itemId);
            setActiveTabs(prev => prev.filter(item => item.id !== itemId));
        } else {
            originGroupIndex = groups.findIndex(group => group.id === originGroupId);
            draggedTab = groups[originGroupIndex].tabs.find(item => item.id === itemId);
            setGroups(prev => prev.map(group => {
                if (group.id === originGroupId) {
                return { ...group, tabs: group.tabs.filter(item => item.id !== itemId) };
                }
                return group;
            }));
        }

//新增到新的地方
        if (targetGroupId === 0) {
            setActiveTabs(prev => [...prev, draggedTab]);
            openTab(draggedTab.url)
            return
        } else if (targetGroupId > 0 && targetGroupId !== newGroupId ){
            const targetGroupIndex = groups.findIndex(group => group.id === targetGroupId);
            setGroups(prev => prev.map((group, index) => {
                if (index === targetGroupIndex) {
                    return { ...group, tabs: [...group.tabs, draggedTab] };
                }
                return group;
            }));
            closeTab(draggedTab.id) 
        } else if (targetGroupId === newGroupId){
            setGroups(prev => prev.map((group, index) => {
                const newGroupIndex = newGroupId - 1
                if (index === newGroupIndex ) {
                 return { ...group, tabs: [...group.tabs, draggedTab] };
                }
                return group;
            }));
            closeTab(draggedTab.id)
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    
    const handleAddGroup = (newGroupId) => {
      setGroups(prev => [
        ...prev,
        { id: newGroupId, name: `group${newGroupId}`, tabs: [] }
      ]);
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
                groups={groups}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragStart={handleDragStart}
                newGroupId={newGroupId}
                handleAddGroup={handleAddGroup}
            />
        </div>
        <button onClick={() => handleAddGroup(newGroupId)} > add group</button>
    </>
    );
}

export default DragDropComponent;
