import { useState } from 'react';
import '../../scss/main/note.scss'


function Note({item}) {

  const [noteContent, setNoteContent] = useState(item.note_content);
  const noteBgColor = item.note_bgColor

  //尚未寫 更改note的patchAPI 
  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };



  return (
    <>
    <div 
      className='tabItem' //沿用其他tab的樣式
      style={{backgroundColor: noteBgColor}}
    >

      <textarea
        placeholder="New note"
        className='note'
        value={noteContent}
        onChange={handleNoteChange}
        style={{backgroundColor: noteBgColor}}
      >
      </textarea>
    </div>
    </>
  );
}

export default Note;
