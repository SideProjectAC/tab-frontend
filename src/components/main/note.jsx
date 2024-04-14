import { useState } from 'react'
import '../../scss/main/note.scss'
import { postNoteAPI, deleteItemFromGroupAPI } from '../../api/itemAPI'
import { useGroups } from '../useContext/groupContext'
import noteItemPropTypes from 'prop-types'

function Note({ item, groupId }) {
  const { setGroups } = useGroups()
  const [noteContent, setNoteContent] = useState(item?.item_noteContent)
  const notebgColor = '#f7f7f7'

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleAddNote()
    }
  }

  const handleAddNote = async () => {
    const newNoteData = { note_content: noteContent, note_bgColor: notebgColor }
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
                  note_bgColor: notebgColor,
                },
              ],
            }
          : group
      )
    )
    setNoteContent('')
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
        className='noteItem'
        style={{ backgroundColor: item?.note_bgColor }}>
        <textarea
          className='note'
          value={item?.note_content}
          onChange={handleNoteChange}
          onKeyDown={handleKeyDown}
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
