import { useState } from 'react'
import '../../scss/main/note.scss'
import { postNoteAPI, deleteItemFromGroupAPI } from '../../api/itemAPI'
import { useGroups } from '../useContext/groupContext'
import noteItemPropTypes from 'prop-types'

function Note({ item, groupId }) {
  const { setGroups } = useGroups()
  const [noteContent, setNoteContent] = useState(item.item_noteContent)
  const notebgColor = '#f7f7f7'

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value)
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddNote()
    }
  }



  const handleAddNote = async () => {
    const newNoteData = { note_content: noteContent, note_bgColor: notebgColor }
    const response = await postNoteAPI(groupId, newNoteData)
    console.log(response)
    // const newNote = {
    //   group_id: response.group_id,
    //   noteContent: newNoteData.note_content,
    //   noteBgColor: newNoteData.note_bgColor,
    //   item_type: 1,
    //   item_id: response.item_id,
    // }
    // setNoteContent('')
  }

  const handleDeleteNote = async (groupId) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.group_id === groupId) {
          return {
            ...group,
            items: group.items.filter(
              (gitem) => gitem.item_id !== item.item_id
            ),
          }
        }
        return group
      })
    )

    try {
      await deleteItemFromGroupAPI(groupId, item.item_id)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <div
        className='noteItem' //沿用其他tab的樣式
        style={{ backgroundColor: item.note_bgColor }}>
        <textarea
          className='note'
          value={item.note_content}
          onChange={handleNoteChange}
          onKeyDown={handleNoteChange}
          style={{ backgroundColor: item.note_bgColor }}></textarea>
        <button
          className='deleteButton'
          onClick={() => handleDeleteNote(groupId)}>
          x
        </button>
      </div>
    </>
  )
}
// function Note({ item }) {
//   const [noteContent, setNoteContent] = useState(item.note_content)
//   const noteBgColor = item.note_bgColor

//   const handleNoteChange = (event) => {
//     setNoteContent(event.target.value)
//   }

//   const handleAddNote = async (event) => {
//     setNoteContent(event.target.value)

//     const newNoteData = { noteContent, noteBgColor }
//     const response = await postNoteAPI(newNoteData)
//     console.log(response)
// if (event.key === 'Enter') {
//   handleAddNote()
// }
// const newNote = {
//   group_id: response.data.group_id,
//   noteContent: newNoteData.noteContent,
//   noteBgColor: newNoteData.noteBgColor,
// }
//   setNoteContent('')
// }

//   return (
//     <>
//       <div
//         className='tabItem' //沿用其他tab的樣式
//         style={{ backgroundColor: noteBgColor }}>
//         <textarea
//           placeholder='New note'
//           className='note'
//           value={noteContent}
//           onChange={handleNoteChange}
//           onKeyDown={handleNoteChange}
//           style={{ backgroundColor: noteBgColor }}></textarea>
//       </div>
//     </>
//   )
// }

Note.propTypes = noteItemPropTypes

export default Note
