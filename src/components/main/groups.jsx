import { useGroups } from "./groupContext"
import { useEffect,useRef } from 'react';
import Group from "./group";
import { postNewGroupAPI,deleteGroupAPI } from "../../api/groupAPI";

function Groups ({
  handleDrop,
  handleDragOver,
  handleDragStart,
}) {

  const {groups, setGroups} = useGroups()

  const newGroupId = useRef(null);
    useEffect(()=>{
        newGroupId.current = groups.length > 0 ? groups[groups.length -1].group_id : undefined;
    },[groups])

 const handleAddGroup = async () =>{
    const emojiList = ["🎀","⚽","🎾","🏁","😡","💎","🚀","🌙","🎁","⛄","🌊","⛵","🏀","🐷","🐍","🐫","🔫","🍉","💛"]
    const tempEmoji = emojiList[Math.floor(Math.random() * emojiList.length)]
    
    //post newGroup API
    try{
        const response = await postNewGroupAPI({group_icon:tempEmoji, group_title:"Untitled"})
        console.log('API post newGroup response',response.data)
        setGroups(prev => [
        ...prev,
        {  group_id: response.data.group_id, group_icon: tempEmoji, group_title: "Untitled", items: [] }
        ]);
    } catch(error) {
        console.error('error in adding group',error)
    }
      
  };



  async function handleDeleteGroup (groupId)  {
    try {
      await deleteGroupAPI(groupId);
      console.log('Group deleted successfully');

      setGroups(prev => prev.filter(group => group.group_id !== groupId))
    } catch (error) {
      console.error('Error deleting group', error);
    }
    
  }
 
  const handleSiteCount = (groupId) => {
    const group = groups.find(g => g.group_id === groupId);
    if (group) {
      group.items.forEach(item => {
        chrome.tabs.create({ url: item.url, active: false });
      });
    } else {
      console.error('Group not found:', groupId);
    }
  };

  

  return (
    <>
      <div className='groups'>
        {groups.map(group => (
          <Group
          key={group.group_id}
          group={group}
          handleDrop={handleDrop}
          handleDragStart={handleDragStart}
          handleSiteCount={handleSiteCount}
          handleDeleteGroup={handleDeleteGroup}
          handleDragOver={handleDragOver}

        />
        ))}
      </div>
        <div className='newGroup'
          onDrop={(e) => {
            (async () => {
              await handleAddGroup();
              await handleDrop(e, newGroupId.current);
            })();
          }} 
          onDragOver={handleDragOver}
        ></div>

    </>
  )
}

export default Groups