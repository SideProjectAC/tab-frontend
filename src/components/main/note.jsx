import { useState } from "react";
import "../../scss/main/note.scss";
import {
  postNoteAPI,
  patchNoteAPI,
  deleteItemFromGroupAPI,
  patchTodoAPI,
} from "../../api/itemAPI";
import { useGroups } from "../useContext/groupContext";
import noteItemPropTypes from "prop-types";

function Note({ item, groupId }) {
  const { setGroups } = useGroups();
  const [noteContent, setNoteContent] = useState(item?.note_content || "");
  const [noteType, setNoteType] = useState(item?.item_type || 1); //TODO 需要預設為1就好嗎？
  const noteBgColor = "#f7f7f7"; //暫無變換顏色功能
  const noteItemClass = !noteContent ? "new-noteItem" : "noteItem";
  const [isChecked, setIsChecked] = useState(false);

  const handleAddNote = async () => {
    const newNoteData = {
      note_content: noteContent,
      note_bgColor: noteBgColor,
    };
    const response = await postNoteAPI(groupId, newNoteData);
    console.log(response);

    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.group_id === groupId
          ? {
              ...group,
              items: [
                ...group.items,
                {
                  item_id: response.item_id,
                  item_type: 1,
                  note_content: noteContent,
                  note_bgColor: noteBgColor,
                },
              ],
            }
          : group
      )
    );
    setNoteContent("");
  };
  const handlePatchNoteContent = async () => {
    const patchNoteContent = { note_content: noteContent };
    const response = await patchNoteAPI(
      groupId,
      item?.item_id,
      patchNoteContent
    );
    console.log(response);
  };

  //FIX 這個版本可以快速切換，但是不一定能打出正確 API
  // const handlePatchNoteType = async () => {
  //   const patchAPI = noteType === 1 ? patchNoteAPI : patchTodoAPI
  //   const newNoteType = noteType === 1 ? 2 : 1
  //   setNoteType(newNoteType)
  //   const patchNoteType = { item_type: newNoteType }
  //   try {
  //     // console.log(groupId, item?.item_id, patchNoteType)
  //     await patchAPI(groupId, item.item_id, patchNoteType)
  //     console.log(
  //       `Patch ${
  //         noteType === 1 ? 'note' : 'todo'
  //       } type request sent successfully.`
  //     )
  //   } catch (error) {
  //     console.log('Error patching item type:', error)
  //   }
  // }

  //FIX 這個版本只有正確打出 API 才可以自由切換
  const handlePatchNoteType = async () => {
    try {
      const newNoteType = noteType === 1 ? 2 : 1;
      const patchAPI = noteType === 1 ? patchNoteAPI : patchTodoAPI;
      const patchNoteType = { item_type: newNoteType };

      await patchAPI(groupId, item?.item_id, patchNoteType);
      console.log(
        `Patch ${
          newNoteType === 1 ? "note" : "todo"
        } type request sent successfully.`
      );

      setNoteType(newNoteType);
    } catch (error) {
      console.log("Error patching item type:", error);
    }
  };

  const handleChangeNote = (event) => {
    event.key !== "Enter"
      ? setNoteContent(event.target.value)
      : (() => {
          event.preventDefault();
          item ? handlePatchNoteContent() : handleAddNote();
        })();
  };

  const handleDeleteNote = async (groupId) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.group_id === groupId) {
          return {
            ...group,
            items: group.items.filter(
              (gItem) => gItem.item_id !== item.item_id
            ),
          };
        }
        return group;
      })
    );

    try {
      await deleteItemFromGroupAPI(groupId, item.item_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        key={item?.item_id}
        className={noteItemClass}
        // style={{ backgroundColor: item?.note_bgColor }}
      >
        {noteType === 2 && (
          <input
            className="CheckBox"
            type="checkbox"
            onChange={(e) => setIsChecked(e.target.checked)}
          ></input>
        )}
        <textarea
          className={isChecked ? "checked note" : "note"}
          value={noteContent}
          onChange={handleChangeNote}
          onKeyDown={handleChangeNote}
          // style={{ backgroundColor: item?.note_bgColor }}
        ></textarea>
        {item && (
          <div>
            <button className="switchNoteButton" onClick={handlePatchNoteType}>
              切換
            </button>
            <button
              className="deleteButton"
              onClick={() => {
                handleDeleteNote(groupId);
              }}
            >
              x
            </button>
          </div>
        )}
      </div>
    </>
  );
}

Note.propTypes = noteItemPropTypes;

export default Note;
