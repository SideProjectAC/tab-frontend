import { useState,useEffect} from 'react';
import { useChromeTabs } from './chromeTabsContext'
import { useGroups } from './groupContext';
import ActiveTabs from './activeTab';
import Groups from './groups';
import '../../styles/main/drag.css'
import { fetchGroupsAPI,postNewGroupAPI } from '../../api/groupAPI';



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
   const newGroupId = (groups.length + 1).toString();

    
    useEffect(() => {
        setActiveTabs(chromeTabs)
    },[chromeTabs,groups])


    async function loadGroups() {
        try {
        const response = await fetchGroupsAPI();
        console.log('Groups fetched: ', response.data);
        setGroups(response.data)
        } catch (error) {
        console.error('Error fetching groups', error);
        }
    }
    
    function handleFetch(){
        loadGroups();
        console.log('groups frontEnd',groups)
    }

    const handleDragStart = (e, itemId, originGroupId) => {
        e.dataTransfer.setData("itemId", itemId);
        e.dataTransfer.setData("originGroupId",originGroupId);
        e.dataTransfer.effectAllowed = 'move';
    };


    const handleDrop = (e, targetGroupId) => {
        e.preventDefault();
        const itemId = parseInt(e.dataTransfer.getData("itemId"), 10);
        const originGroupId = e.dataTransfer.getData("originGroupId")
        const originGroupIndex = groups.findIndex(group => group.group_id === originGroupId);

        if (originGroupId === targetGroupId) return; 

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
        }

//新增到新的地方
        if (targetGroupId === 'ActiveTabs') {
            //TODO: 以下setActive有bug!
            setActiveTabs(prev => [...prev, draggedTab]);
            openTab(draggedTab.url)
            return
        }
        setGroups(prev => prev.map(group => {
            if (group.group_id === targetGroupId) {
                return { ...group, items: [...group.items, draggedTab] };
            }
        return group;
        }));
    };
    

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
       

    const handleAddGroup = async (newGroupId) =>{
        const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"]
        const tempEmoji = emojiList[Math.floor(Math.random() * emojiList.length)]
        
        //post newGroup API
        // try{
        //     const response = await postNewGroupAPI({group_icon:tempEmoji, group_title:"Untitled"})
        //     console.log('API post newGroup response',response.data)
            setGroups(prev => [
            ...prev,
            ////TODO:最前面應該是group.group_id 不是 id -> id: response.data.group_id,
            { group_id:newGroupId, group_icon: tempEmoji, group_title: "Untitled", items: [] }
            ]);
        // } catch(error) {
        //     console.error('error in adding group',error)
        // }
       
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
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                handleDragStart={handleDragStart}
                newGroupId={newGroupId}
                handleAddGroup={handleAddGroup}
            />
        </div>
        <button onClick={() => handleAddGroup(newGroupId)} > add group</button>
        <button onClick={() => handleFetch()} > fetch Data</button>
    </>
    );
}

export default DragDropComponent;
