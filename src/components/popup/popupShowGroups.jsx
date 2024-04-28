import { useState, useEffect } from "react";
import { postNoteAPI } from "../../api/itemAPI";
import { getGroupAPI } from "../../api/groupAPI";

const PopupGroups = ({ note, setShowGroups }) => {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getGroupAPI();
      setGroups(response.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleSaveNote = async (groupId) => {
    const noteData = {
      note_content: note,
      note_bgColor: "#f7f7f7",
    };
    const response = await postNoteAPI(groupId, noteData);
    if (response.status === "success") setShowGroups(false);
    localStorage.setItem("needReload", "true");
    window.close();
  };

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
        {isLoading ? "" : groups.length === 0 && <h1> No Groups yet!</h1>}
      </div>
    </>
  );
};

export default PopupGroups;
