import EmojiPicker from "emoji-picker-react";
import { useGroups } from "./groupContext"
import { useState } from "react";


function Emoji ({groupId ,groupIcon}) {
  
  const [showEmojiGroupId, setShowEmojiGroupId] = useState(null)
  const {setGroups} = useGroups()

  function handleToggleEmojiPicker() { 
    setShowEmojiGroupId(prevGroupId => prevGroupId === groupId ? null : groupId);
  }
  
  
  
  const updateEmoji = (emojiData) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.group_id === groupId ? { ...group, group_icon: emojiData.emoji } : group
      )
    );
  };


  return (
    <>
    <div className="groupIcon"
      onClick={() =>handleToggleEmojiPicker(groupId)}
    >  
      {groupIcon}
    </div> 
      {showEmojiGroupId === groupId && 
        <EmojiPicker onEmojiClick={(emojiData) => {
            updateEmoji(groupId, emojiData);
            setShowEmojiGroupId(null);
          }}
        />}
    
    </>
  )
}

export default Emoji