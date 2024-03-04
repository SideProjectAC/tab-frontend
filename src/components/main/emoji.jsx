import EmojiPicker from "emoji-picker-react";
import { useGroups } from "./groupContext"


function Emoji ({groupId ,setShowEmojiGroupId}) {
  const {setGroups} = useGroups()
  
  const updateEmoji = (groupId, emojiData) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.group_id === groupId ? { ...group, group_icon: emojiData.emoji } : group
      )
    );
  };


  return (
    <EmojiPicker style={{ position: 'absolute'}}
      onEmojiClick={(emojiData) => {
        updateEmoji(groupId, emojiData);
        setShowEmojiGroupId(null);
      }}
    />
  )
}

export default Emoji