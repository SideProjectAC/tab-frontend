import { useGroups } from "./groupContext"
import Group from "./group";
import { fetchGroupsAPI, deleteGroupAPI } from "../../api/groupAPI";

function Groups ({
  handleDrop,
  handleDragOver,
  handleDragStart,
  newGroupId,
  handleAddGroup
}) {

  const {groups, setGroups} = useGroups()

 async function loadGroups() {
    try {
      const response = await fetchGroupsAPI();
      console.log('Groups fetched: ', response.data);
      // Process the fetched groups as needed
    } catch (error) {
      console.error('Error fetching groups', error);
    }
  }
  // loadGroups()

//"46d983fe-91f7-4566-8ee4-d8601cd3d0af"

  const handleDeleteGroup = (groupId) => {
    setGroups(prev => prev.filter(group => group.group_id !== groupId))
    // deleteGroupAPI("8f76fd65-b6ed-41be-926d-4930a174f58c")
    //  .then(() => {
    //   console.log('Group API deleted successfully',groupId);
    // })
    // .catch(error => {
    //   console.error('Error deleting group', error);
    // });
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
        {/* {groups.slice(1).map(group => ( */}
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