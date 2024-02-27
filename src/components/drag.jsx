import { useEffect, useState } from 'react';
import { useChromeTabs } from './activeTabsContext'
import { useGroups } from './groupContext';
import TabItem from './tabItem';
import '../styles/drag.css'

function closeTab(tabId) {
  chrome.tabs.remove(tabId);
}

function openTab(url) {
    chrome.tabs.create({url:url, active: false })
}

function DragDropComponent() {
    const {groups , setGroups,handleAddGroup} = useGroups()
    const {chromeTabs} = useChromeTabs()
    const [activeTabs, setActiveTabs] = useState([]);


    useEffect(() => {
        setActiveTabs(chromeTabs)
    },[chromeTabs])


    const handleDragStart = (e, tabId, originGroupId) => {
        e.dataTransfer.setData("tabId", tabId);
        e.dataTransfer.setData("originGroupId",originGroupId);
        e.dataTransfer.effectAllowed = 'move';
    };


    const handleDrop = (e, targetGroupId) => {
        e.preventDefault();
        const tabId = parseInt(e.dataTransfer.getData("tabId"), 10);
        const originGroupId =  parseInt(e.dataTransfer.getData("originGroupId"), 10);

        if (originGroupId === targetGroupId) {
            return; // Item dropped in the same zone it was dragged from
        }

        // Moving item from one zone to another (or back to the original list)
        let draggedTab;
        let originGroupIndex;

// 刪除原本的位置
        if (originGroupId === 0) {
            draggedTab = activeTabs.find(item => item.id === tabId);
            setActiveTabs(prev => prev.filter(item => item.id !== tabId));
        } else {
            originGroupIndex = groups.findIndex(group => group.id === originGroupId);
            draggedTab = groups[originGroupIndex].tabs.find(item => item.id === tabId);
            setGroups(prev => prev.map(group => {
                if (group.id === originGroupId) {
                return { ...group, tabs: group.tabs.filter(item => item.id !== tabId) };
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
    
    const newGroupId = groups.length + 1; 

    // const handleAddGroup = () => {
    //     setGroups(prev => [
    //         ...prev,
    //         { id: newGroupId, name: `group${newGroupId}`, tabs: [] }
    //     ]);
    // };

    return (
        <>
        <div className='wrapper'>
            <div className='activeList'
                onDrop={(e) => handleDrop(e, 0)} 
                onDragOver={handleDragOver}
            >
                {activeTabs.map((item) => (
                    <div className='activeTab'
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id, 0)}
                    >
                        <TabItem tab={item} /> 
                     </div>
                ))}
            </div>
            <div className='groups'>
                {groups.map(group => (
                    <div
                        className='group'
                        key={group.id}
                        onDrop={(e) => handleDrop(e, group.id)}
                        onDragOver={handleDragOver}
                    >
                        Drop items here ({group.name})
                        <div>
                            {group.tabs.map(item => (
                                <div 
                                    key={item.id} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, item.id, group.id)}
                                >
                                    <TabItem tab={item} /> 
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className='newGroup'
                onDrop={(e) => {
                    handleAddGroup(newGroupId)
                    handleDrop(e, newGroupId)
                }} 
                onDragOver={handleDragOver}

            ></div>
        </div>
        <button onClick={() => handleAddGroup(newGroupId)}>add group</button>

        </>
    );
}

export default DragDropComponent;
