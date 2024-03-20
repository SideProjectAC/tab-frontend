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
        chrome.tabs.create({ url: item.browserTab_url, active: false });
      });
    } else {
      console.error('Group not found:', groupId);
    }
  };

  

  return (
    <>
    <div className="groups">
      <div className='groupList'>
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
          onDragOver={handleDragOver}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(e, newGroupId);
          }} 
        ></div>
    </div>
      
    </>
  )
}

export default Groups