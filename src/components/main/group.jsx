import TabItem from "./tabItem"
import EmojiPicker from "emoji-picker-react";

function Group({ group, handleDrop, handleDragStart, handleSiteCount, handleDeleteGroup,handleDragOver, showEmojiPicker, toggleEmojiPicker, updateEmoji,setShowEmojiGroupId }) {
  return (
    <div
      className='group'
      key={group.group_id}
      onDrop={(e) => handleDrop(e, group.group_id)}
      onDragOver={handleDragOver}
    >
      <div className="groupInfo">
        <div className="groupIcon" onClick={() => toggleEmojiPicker(group.group_id)}>  
          {group.group_icon}
        </div> 
        <h2 className="groupTitle">{group.group_title}</h2>
        <button onClick={() => handleSiteCount(group.group_id)}>
          {group.items.length} Sites ➡️
        </button>
        <button className="deleteButton"
          onClick={() => handleDeleteGroup(group.group_id)}>x</button>
      </div>
      
      {showEmojiPicker && <EmojiPicker 
        onEmojiClick={(emojiData) => {
          updateEmoji(emojiData, group.group_id);
           setShowEmojiGroupId(null)
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
  );
}


export default Group