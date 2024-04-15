import { useState } from 'react'
import '../../scss/main/note.scss'
import {
  postNoteAPI,
  patchNoteAPI,
  deleteItemFromGroupAPI,
} from '../../api/itemAPI'
import { useGroups } from '../useContext/groupContext'
import noteItemPropTypes from 'prop-types'

function Note({ item, groupId }) {
  const { setGroups } = useGroups()
  const [noteContent, setNoteContent] = useState(item?.note_content || '')
  const noteBgColor = '#f7f7f7' //暫無變換顏色功能

  const handleAddNote = async () => {
    const newNoteData = {
      note_content: noteContent,
      note_bgColor: noteBgColor,
    }
    const response = await postNoteAPI(groupId, newNoteData)
    console.log(response)

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
    )
    setNoteContent('')
  }
  const handlePatchNote = async () => {
    const patchNoteData = { note_content: noteContent }
    const response = await patchNoteAPI(groupId, item?.item_id, patchNoteData)
    console.log(response)
  }

  const handleChangeNote = (event) => {
    event.key !== 'Enter'
      ? setNoteContent(event.target.value)
      : (() => {
          event.preventDefault()
          item ? handlePatchNote() : handleAddNote()
        })()
  }

  const handleDeleteNote = async (groupId) => {
    setGroups((prev) =>
      prev.map((group) => {
        if (group.group_id === groupId) {
          return {
            ...group,
            items: group.items.filter(
              (gItem) => gItem.item_id !== item.item_id
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
      <div className='noteItem' style={{ backgroundColor: item?.note_bgColor }}>
        <textarea
          className='note'
          value={noteContent}
          onChange={handleChangeNote}
          onKeyDown={handleChangeNote}
          style={{ backgroundColor: item?.note_bgColor }}></textarea>
        <button
          className='deleteButton'
          onClick={() => handleDeleteNote(groupId)}>
          x
        </button>
      </div>
    </>
  )
}

Note.propTypes = noteItemPropTypes

export default Note
