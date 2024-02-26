import { useEffect, useState } from 'react';
import { useActiveTabs } from './activeTabsContext'
import { useGroups } from './groupContext';
import TabItem from './tabItem';
import '../styles/drag.css'

function DragDropComponent() {
    const {groups} = useGroups()
    const {tabs} = useActiveTabs()
    const [activeTabs, setActiveTabs] = useState([]);
    const [droppedTabs, setDroppedTabs] = useState([]);

    useEffect(() => {
        setActiveTabs(tabs)
        setDroppedTabs(groups)
    },[tabs,groups])


    const handleDragStart = (e, tabId, originGroupId) => {
        e.dataTransfer.setData("tabId", tabId.toString());
        e.dataTransfer.setData("originGroupId",originGroupId.toString());
    };


    const handleDrop = (e, targetGroupId) => {
        e.preventDefault();
        const tabId = parseInt(e.dataTransfer.getData("tabId"), 10);
        const originGroupId = e.dataTransfer.getData("originGroupId");

        if (originGroupId === targetGroupId) {
            return; // Item dropped in the same zone it was dragged from
        }

        // Moving item from one zone to another (or back to the original list)
        let draggedTab;
        let originGroupIndex;
// 刪除原本的位置
        if (originGroupId === '0') {
            draggedTab = activeTabs.find(item => item.id === tabId);
            setActiveTabs(prev => prev.filter(item => item.id !== tabId));
        } else {
            originGroupIndex = droppedTabs.findIndex(group => group.id.toString() === originGroupId);
            draggedTab = droppedTabs[originGroupIndex].tabs.find(item => item.id === tabId);
            setDroppedTabs(prev => prev.map(group => {
                if (group.id.toString() === originGroupId) {
                return { ...group, tabs: group.tabs.filter(item => item.id !== tabId) };
                }
                return group;
            }));
        }
//新增到新的地方
        if (targetGroupId === '0') {
            setActiveTabs(prev => [...prev, draggedTab]);
        } else {
            const targetGroupIndex = droppedTabs.findIndex(group => group.id.toString() === targetGroupId);
            setDroppedTabs(prev => prev.map((group, index) => {
                if (index === targetGroupIndex) {
                return { ...group, tabs: [...group.tabs, draggedTab] };
                }
                return group;
            }));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleAddGroup = () => {
        const newGroupId = groups.length + 1; 
        
        setDroppedTabs(prev => [
            ...prev,
            { id: newGroupId, name: `group${newGroupId}`, tabs: [] }
        ]);
    };

    return (
        <>
        <div className='wrapper'>
            <div className='activeList'
                onDrop={(e) => handleDrop(e, 'items')} 
                onDragOver={handleDragOver}
            >
                {activeTabs.map((item) => (
                    <div className='activeTab'
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id, '0')}
                    >
                        <TabItem tab={item} /> 
                     </div>
                ))}
            </div>
            <div className='groups'>
                {droppedTabs.map(group => (
                    <div
                        className='group'
                        key={group.id}
                        onDrop={(e) => handleDrop(e, group.id.toString())}
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
        </div>
        <button onClick={handleAddGroup}>add group</button>
        </>
    );
}

export default DragDropComponent;
