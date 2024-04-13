import { useState } from 'react'
import '../../scss/main/note.scss'
import { postNoteAPI } from '../../api/itemAPI'

function Note({ item }) {
  const [noteContent, setNoteContent] = useState(item.note_content)
  const noteBgColor = item.note_bgColor

  const handleNoteChange = (event) => {
    setNoteContent(event.target.value)
    if (event.key === 'Enter') {
      handleAddNote()
    }
  }

  const handleAddNote = async () => {
    const newNoteData = { noteContent, noteBgColor }
    const response = await postNoteAPI(newNoteData)
    const newNote = {
      group_id: response.data.group_id,
      noteContent: newNoteData.noteContent,
      noteBgColor: newNoteData.noteBgColor,
    }
    setNoteContent('')
  }

  return (
    <>
      <div
        className='tabItem' //沿用其他tab的樣式
        style={{ backgroundColor: noteBgColor }}>
        <textarea
          placeholder='New note'
          className='note'
          value={noteContent}
          onChange={handleNoteChange}
          onKeyDown={handleNoteChange}
          style={{ backgroundColor: noteBgColor }}></textarea>
      </div>
    </>
  )
}

export default Note
