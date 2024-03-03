import {  useState } from "react";
import { useGroups } from "./groupContext"
import TabItem from "./tabItem"
import Emoji from "./emoji";
import Note from "./note";
import { updateGroupAPI } from "../../api/groupAPI";

function Group({ 
  group,
  handleDrop,
  handleDragStart,
  handleSiteCount,
  handleDeleteGroup,
  handleDragOver,
}) {

  const [showEmojiGroupId, setShowEmojiGroupId] = useState(null)
  const [groupTitle, setGroupTitle] =useState('Untitled')
  const { setGroups} = useGroups()


  function handleTitleChange (e) {
    setGroupTitle(e.target.value)
  }
  
  function handleTitleUpdate(groupId) {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.group_id === groupId ? { ...group, group_title: groupTitle } : group
      )
    );
    
    const titleUpdate = {group_title: groupTitle}
    updateGroupAPI(groupId, titleUpdate)
    .then(response => {
      console.log('Group Title updated successfully', response.data);
    })
    .catch(error => {
      console.error('Error updating group Title', error);
    });
  }

  
  return (
    <div
      className='group'
      key={group.group_id}
      onDrop={(e) => handleDrop(e, group.group_id)}
      onDragOver={handleDragOver}
    >
      <div className="groupInfo">
        <div className="groupIcon" onClick={() => setShowEmojiGroupId(group.group_id)}>  
          {group.group_icon}
        </div> 
        <input className="groupTitle" 
          type="text"
          placeholder={groupTitle}
          onChange={handleTitleChange}
          onBlur={() => handleTitleUpdate(group.group_id)}
        />
        <button onClick={() => handleSiteCount(group.group_id)}>
          {group.items.length} Sites ➡️
        </button>
        <button className="deleteButton"
          onClick={() => handleDeleteGroup(group.group_id)}>x</button>
      </div>
      
      {showEmojiGroupId && 
        <Emoji 
          groupId={group.group_id}
          setShowEmojiGroupId={setShowEmojiGroupId}/>}

      <div>
        {group.items.map(item => (
          <div 
            key={item.id} 
            draggable 
            onDragStart={(e) => handleDragStart(e, item.id, group.group_id)}
          >
            <TabItem tab={item} /> 
          </div>
        ))}
      </div>
      <Note/>
    </div>
  );
}


export default Group