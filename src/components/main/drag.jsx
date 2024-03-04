import { useState,useEffect} from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'
import { postNewGroupAPI } from '../../api/groupAPI';



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
    const newGroupId = groups.length +1 ; 


    // useEffect(() => {
    //     setGroups(prev => prev.map((group, index) => {
    //         if (index === 0) { 
    //             return { ...group, items: chromeTabs };
    //         }
    //         return group;
    //     }));
    // },[setGroups,chromeTabs])
    
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
        
        // let draggedTab = groups[originGroupId].items.find(item => item.id === itemId)
        // setGroups(prev => prev.map(group => {
        //     // Remove the dragged item from its origin group
        //     if (group.group_id === originGroupId) {
        //         return { ...group, items: group.items.filter(item => item.id !== itemId) };
        //     }
        //     // Add the dragged item to the target group
        //     if (group.group_id === targetGroupId) {
        //         return { ...group, items: [...group.items, draggedTab] };
        //     }
        //     // Return all other groups unmodified
        //     return group;
        // }));
        // if (targetGroupId === 0) openTab(draggedTab.url)
        // if (originGroupId === 0) closeTab(draggedTab.id)

        let draggedTab;
        let originGroupIndex;

         if (originGroupId === 0) {
            draggedTab = activeTabs.find(item => item.id === itemId);
            setActiveTabs(prev => prev.filter(item => item.id !== itemId));
        } else {
            originGroupIndex = groups.findIndex(group => group.group_id === originGroupId);
            draggedTab = groups[originGroupIndex].items.find(item => item.id === itemId);
            setGroups(prev => prev.map(group => {
                if (group.group_id === originGroupId) {
                return { ...group, items: group.items.filter(item => item.id !== itemId) };
                }
                return group;
            }));
        }
    //新增到新的地方
        if (targetGroupId == 0) {
            setActiveTabs(prev => [...prev, draggedTab]);
            openTab(draggedTab.url)
            return
        } else if (targetGroupId > 0 && targetGroupId !== newGroupId ){
            const targetGroupIndex = groups.findIndex(group => group.group_id=== targetGroupId);
            setGroups(prev => prev.map((group, index) => {
                if (index === targetGroupIndex) {
                    return { ...group, items: [...group.items, draggedTab] };
                }
                return group;
            }));
            closeTab(draggedTab.id) 
        } else if (targetGroupId == newGroupId){
            setGroups(prev => prev.map((group, index) => {
                const newGroupIndex = newGroupId - 1
                if (index === newGroupIndex ) {
                 return { ...group, items: [...group.items, draggedTab] };
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
       

    const handleAddGroup = (newGroupId) =>{
        const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"]
        const emoji = emojiList[Math.floor(Math.random() * emojiList.length)]
        setGroups(prev => [
        ...prev,
        { group_id: newGroupId, group_icon: emoji, group_title: "Untitled", items: [] }
        ]);

        //API
        // postNewGroupAPI({group_icon:emoji, group_title:"Untitled"})
        // .then(response => {
        //     console.log('api post response',response)
        // })
        // .catch(error => {console.error('error adding Group',error)})

    };
    return (
    <>
        <div className='wrapper'>
            <ActiveTabs
                // activeTabs={groups[0].items}
                activeTabs={activeTabs}
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
