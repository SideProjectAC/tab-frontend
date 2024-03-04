import { useGroups } from "./groupContext"
import { useEffect } from 'react';
import Group from "./group";
import { deleteGroupAPI } from "../../api/groupAPI";

function Groups ({
  handleDrop,
  handleDragOver,
  handleDragStart,
  newGroupId,
  handleAddGroup
}) {

  const {groups, setGroups} = useGroups()

 



  async function handleDeleteGroup (groupId)  {
    try {
      await deleteGroupAPI("d3ca10d3-db2f-460c-9a14-19e072491a7b");
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
            handleAddGroup(newGroupId)
            handleDrop(e, newGroupId)
          }} 
          onDragOver={handleDragOver}
        ></div>

    </>
  )
}

export default Groups