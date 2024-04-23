import { postNoteAPI } from "../../api/itemAPI";
import { useGroups } from "../useContext/groupContext";
import { useEffect } from "react";

const PopupGroups = ({ note, setShowGroups }) => {
  const { groups, setGroups } = useGroups();

  useEffect(() => {
    console.log(groups);
  }, [groups]);

  const handleSaveNote = async (groupId) => {
    const noteData = {
      note_content: note,
      note_bgColor: "#c5c5c5",
    };
    const response = await postNoteAPI(groupId, noteData);
    if (response.status === "success") setShowGroups(false);

    const newAddNote = {
      item_type: 1,
      item_id: response.item_id,
      note_content: note,
      note_bgColor: "#c5c5c5",
    };

    setGroups((prev) =>
      prev.map((group) =>
        group.group_id === groupId
          ? { ...group, items: [...group.items, newAddNote] }
          : group
      )
    );
  };

  // const handleSaveToNewGroup = async () => {
  //   const newGroup = {
  //     "group_icon": "📝",
  //     "group_title": "from popup"
  //   }
  //   const response = await postGroupAPI(newGroup)

  // }

  return (
    <>
      <div className="popupAddGroupWrapper">
        <h3 className="popupAddTitle">Add Note to which Group?</h3>

        <div className="popupGroupList">
          {groups.map((group) => (
            <div
              className="popupGroup"
              onClick={() => handleSaveNote(group.group_id)}
              key={group.group_id}
            >
              <div className="popupGroupInfo">{group.group_icon}</div>
              <div className="popupGroupInfo">{group.group_title}</div>
            </div>
          ))}
        </div>
        {groups.length === 0 && <h1> No Groups yet!</h1>}
        {/* <button className='addToNewGroup'
        onClick={() => handleSaveToNewGroup()}
      >add a new Group</button> */}
      </div>
    </>
  );
};

export default PopupGroups;
