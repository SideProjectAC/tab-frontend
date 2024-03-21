import { useState } from 'react';


function Note() {
  // State to keep track of the note's content
  const [noteContent, setNoteContent] = useState('');

  // Handler for changes in the textarea
  const handleNoteChange = (event) => {
    setNoteContent(event.target.value);
  };

  // Determine the class for the textarea based on its content
  const noteClass = noteContent ? "note hasContent" : "note";

  return (
    <>
      <textarea
        placeholder="New note"
        className={noteClass}
        value={noteContent}
        onChange={handleNoteChange}
      ></textarea>
    </>
  );
}

export default Note;
