import EmojiPicker from "emoji-picker-react";
import { useGroups } from "./groupContext"
import { updateGroupAPI } from "../../api/groupAPI";


function Emoji ({groupId ,setShowEmojiGroupId}) {
  const {setGroups} = useGroups()
  
  const updateEmoji = async (groupId, emojiData) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.group_id === groupId ? { ...group, group_icon: emojiData.emoji } : group
      )
    );

    try {
      const response = await updateGroupAPI(groupId, {group_icon: emojiData.emoji});
      console.log('Group emoji updated successfully', response.data);
    } catch (error) {
      console.error('Error updating groupEmoji', error);
    }


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