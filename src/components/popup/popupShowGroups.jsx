import  { useState, useEffect } from 'react';
import { fetchGroupsAPI , postNewGroupAPI} from '../../api/groupAPI'
import { PostNoteAPI } from '../../api/itemAPI';

const PopupGroups = ({note , setShowGroups}) => {

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchGroupsAPI();
      setGroups(response.data);
    };

    fetchData();
  }, []);

  const handleSaveNote = async (groupId) => {
    const noteData = {
      "note_content": note ,
      "note_bgColor":  "#c5c5c5"
    }
    const response = await PostNoteAPI(groupId, noteData)
    if (response.status === 'success') setShowGroups(false)
    const noteId = response.item_id
    console.log('noteId', noteId)
  }

  // const handleSaveToNewGroup = async () => {
  //   const newGroup = {
  //     "group_icon": "📝",
  //     "group_title": "from popup"
  //   }
  //   const response = await postNewGroupAPI(newGroup)

  // }


  return (

    <>
    <div className='popupAddGroupWrapper'>
      <h3 className='popupAddTitle'>Add Note to which Group?</h3>
      
      <div className='popupGroupList'>
        {groups.map((group) => (
          <div className='popupGroup'
          onClick={() => handleSaveNote(group.group_id)}
          key={group.group_id}>
            <div className='popupGroupInfo'>{group.group_icon}</div>
            <div className='popupGroupInfo'>{group.group_title}</div>
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

}

export default PopupGroups