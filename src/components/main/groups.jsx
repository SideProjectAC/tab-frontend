import TabItem from "./tabItem"
import { useState } from "react";
import { useGroups } from "./groupContext"
import EmojiPicker from "emoji-picker-react";

function Groups ( {handleDrop, handleDragOver, handleDragStart, newGroupId, handleAddGroup }) {

  const {groups, setGroups} = useGroups()



  const handleDeleteGroup = (groupId) => {
    setGroups(prev => prev.filter(group => group.group_id !== groupId))
    console.log(groups)
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

  const getSiteCount = (groupId) => {
    const group = groups.find(g => g.group_id === groupId);
    return group ? group.items.length : 0;
  };
  
  const [showEmojiGroupId, setShowEmojiGroupId] = useState(null)
  function handleToggleEmojiPicker(groupId) { 
    setShowEmojiGroupId(prevGroupId => prevGroupId === groupId ? null : groupId);
  }
  
  const updateEmoji = (emojiData,groupId) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.group_id === groupId ? { ...group, group_icon: emojiData.emoji } : group
      )
    );
  };

 
  return (
    <>
      <div className='groups'>
        {groups.slice(1).map(group => (
          <div
            className='group'
            key={group.group_id}
            onDrop={(e) => handleDrop(e, group.group_id)}
            onDragOver={handleDragOver}
          >

            <div className="groupInfo">
              <div className="groupIcon" onClick={() =>handleToggleEmojiPicker(group.group_id)}>  
                {group.group_icon}
              </div> 
              <h2 className="groupTitle">{group.group_title}</h2>
              <button  
                onClick={() => handleSiteCount(group.group_id)}>
                {getSiteCount(group.group_id)} Sites ➡️ </button>
              <button className="deleteButton"
                onClick={() => handleDeleteGroup(group.group_id)}>x</button>
            </div>
            
            {showEmojiGroupId === group.group_id &&  <EmojiPicker 
              onEmojiClick={(emojiData) => {
                updateEmoji (emojiData,group.group_id);
                setShowEmojiGroupId(null);
              }}
            />}

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
          </div>
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