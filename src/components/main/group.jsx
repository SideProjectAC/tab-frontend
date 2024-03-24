import {  useState,useRef} from "react";
import { useGroups } from "./groupContext"
import TabItem from "./tabItem"
import Emoji from "./emoji";
import Note from "./note";
import { updateGroupAPI } from "../../api/groupAPI";
import { groupPropTypes } from "./propTypes";
import '../../scss/main/group.scss';

Group.propTypes = groupPropTypes;

function Group({ 
  group,
  handleDrop,
  handleDragStart,
  handleSiteCount,
  handleDeleteGroup,
  handleDragOver,
}) {

  const {setGroups} = useGroups()
  const [showEmojiGroupId, setShowEmojiGroupId] = useState(null)
  const [title, setTitle] = useState({ current: group.group_title, old: group.group_title });
  const ignoreBlurRef = useRef(false);
  const inputRef = useRef(null)

  
  function handleFocus(e) {
    if (e.target.value === 'Untitled') {
      e.target.select();
    }
  }
  function handleTitleChange (e) {
    setTitle(prev => ({ ...prev, current: e.target.value }));
  }
  
  const handleBlur = (groupId) => {
    if (!ignoreBlurRef.current) {
      handleTitleUpdate(groupId);
    }
  };

  function handleKeyDown(e, groupId) {
    if (e.key === "Enter") {
      e.preventDefault(); 
      handleTitleUpdate(groupId);
      ignoreBlurRef.current = true;
      e.target.blur();
      setTimeout(() => ignoreBlurRef.current = false, 0);  // Re-enable onBlur after a short delay
    }
  }
  async function handleTitleUpdate(groupId) {
    if (title.old === title.current) return; 
    setTitle(prev => ({ ...prev, old: prev.current })); // Update old title to match current
    
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.group_id === groupId ? { ...group, group_title: title.current } : group
      )
    );
    
    try {
      const response = await updateGroupAPI(groupId, {group_title: title.current});
      console.log('Group Title updated successfully', response.data);
    } catch (error) {
      console.error('Error updating groupTitle', error);
    }

  }

   const titleClass = `groupTitle ${title.current !== 'Untitled' ? 'changedTitle' : ''}`;
  
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

        <input className={titleClass} 
          type="text"
          defaultValue={group.group_title}
          ref={inputRef}
          onChange={handleTitleChange}
          onBlur={() => handleBlur(group.group_id)}
          onKeyDown={(e) => handleKeyDown(e, group.group_id)}
          onFocus={handleFocus}
        />

        <button className="openAllButton" onClick={() => handleSiteCount(group.group_id)}>
          {group.items.length} Sites ➡️
        </button>

        <button className="deleteButton"
          onClick={() => handleDeleteGroup(group.group_id)}>x
        </button>

      </div>
      
      {showEmojiGroupId && 
        <Emoji 
          groupId={group.group_id}
          setShowEmojiGroupId={setShowEmojiGroupId}/>}
 
      <div>
        {group.items.map(item => (
          <div 
            key={item.item_id}   
            draggable 
            onDragStart={(e) => handleDragStart(e, item.item_id, group.group_id)}
          >
            <TabItem tab={item} groupId={group.group_id} /> 
          </div>
        ))}
      </div>

      <Note/>

    </div>
  );
}


export default Group