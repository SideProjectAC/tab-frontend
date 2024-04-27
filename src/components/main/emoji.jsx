import EmojiPicker from "emoji-picker-react";
import { useContext } from "react";
import { useGroups } from "../useContext/groupContext";
import { patchGroupAPI } from "../../api/groupAPI";
import { emojiPropTypes } from "./propTypes";
import { ThemeContext } from "../useContext/themeContext";

Emoji.propTypes = emojiPropTypes;

function Emoji({ groupId, setShowEmojiGroupId }) {
  const { setGroups } = useGroups();

  const updateEmoji = async (groupId, emojiData) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.group_id === groupId
          ? { ...group, group_icon: emojiData.emoji }
          : group
      )
    );

    try {
      const response = await patchGroupAPI(groupId, {
        group_icon: emojiData.emoji,
      });
      // console.log('Group emoji updated successfully', response.data);
    } catch (error) {
      console.error("Error updating groupEmoji", error);
    }
  };

  const { theme } = useContext(ThemeContext);

  return (
    <EmojiPicker
      style={{ position: "absolute", zIndex: "100", top: "65px" }}
      onEmojiClick={(emojiData) => {
        updateEmoji(groupId, emojiData);
        setShowEmojiGroupId(null);
      }}
      theme={theme}
    />
  );
}

export default Emoji;
