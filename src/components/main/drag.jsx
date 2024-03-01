import { useEffect} from 'react';
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
    const newGroupId = groups.length; 


    useEffect(() => {
        setGroups(prev => prev.map(group => {
            if (group.group_id === 0) {
            return { ...group, items: chromeTabs };
            }
            return group;
        }));
    },[setGroups,chromeTabs])


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
        
        let draggedTab = groups[originGroupId].items.find(item => item.id === itemId)

        setGroups(prev => prev.map(group => {
            // Remove the dragged item from its origin group
            if (group.group_id === originGroupId) {
                return { ...group, items: group.items.filter(item => item.id !== itemId) };
            }
            // Add the dragged item to the target group
            if (group.group_id === targetGroupId) {
                return { ...group, items: [...group.items, draggedTab] };
            }
            // Return all other groups unmodified
            return group;
        }));

        if (targetGroupId === 0) openTab(draggedTab.url)
        if (originGroupId === 0) closeTab(draggedTab.id)
    };
    

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
       

    const handleAddGroup = (newGroupId) =>{
        const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"]
        const emoji = emojiList[Math.floor(Math.random() * emojiList.length)]
        setGroups(prev => [
        ...prev,
        { group_id: newGroupId, group_icon: emoji, group_title: `Group${newGroupId}`, items: [] }
        ]);
    };
    return (
    <>
        <div className='wrapper'>
            <ActiveTabs
                activeTabs={groups[0].items}
                handleDrop={handleDrop}
                handleDragStart={handleDragStart}
                handleDragOver={handleDragOver}
            />
            <Groups
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
