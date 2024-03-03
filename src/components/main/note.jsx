import { useState } from 'react';
// import { useGroups } from "./groupContext"

function Note() {

  const [showNote, setShowNote] = useState(false);
  // const {groups, setGroups} = useGroups()

  function handleAddNote() {
    setShowNote(prevShowNote => !prevShowNote);
  }

  return (
    <>
      <button onClick={handleAddNote}>show Note</button>
      {showNote && <textarea placeholder='New note'></textarea>}
    </>
  );
}

export default Note;
