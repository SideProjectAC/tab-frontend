import { useState, useEffect } from "react";
import { postNoteAPI, postTabAPI } from "../../api/itemAPI";
import { getGroupAPI } from "../../api/groupAPI";

const PopupGroups = ({ note, setShowGroups, currentTab }) => {
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

  const handleSaveNote = async (groupId, itemLength) => {
    const tabData = {
      browserTab_favIconURL: currentTab.favIconUrl,
      browserTab_title: currentTab.title,
      browserTab_url: currentTab.url,
      browserTab_id: currentTab.id,
      browserTab_index: currentTab.index,
      browserTab_active: currentTab.active,
      browserTab_status: currentTab.status,
      windowId: currentTab.windowId,
      targetItem_position: itemLength,
    };
    const noteData = {
      note_content: note,
      note_bgColor: "#f7f7f7",
    };
    try {
      await postTabAPI(groupId, tabData);
      await postNoteAPI(groupId, noteData);
      setShowGroups(false);
      localStorage.setItem("needReload", "true");
      window.close();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="popupAddGroupWrapper">
        <h3 className="popupAddTitle">Add Note to which Group?</h3>
        <div className="popupGroupList">
          {groups.map((group) => (
            <div
              className="popupGroup"
              onClick={() => handleSaveNote(group.group_id, group.items.length)}
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
