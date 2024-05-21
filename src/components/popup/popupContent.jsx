import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

import Tab from './PopupTab'
import PopupGroups from './PopupShowGroups'
import { popupContentPropTypes } from '../propTypes/propTypes'
Tab.propTypes = popupContentPropTypes

function PopupContent() {
  const [currentTab, setCurrentTab] = useState(null)
  const [showGroups, setShowGroups] = useState(false)
  const [note, setNote] = useState(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0]
      setCurrentTab(activeTab)
    })
  }, [currentTab])

  const handleShowSave = () => {
    if (note.length === 0) return
    setShowGroups(true)
  }

  return (
    <>
      <div id='header'>
        <FontAwesomeIcon
          icon={faXmark}
          className='popup-button delete'
          onClick={() => window.close()}
        />
      </div>
      {showGroups && (
        <PopupGroups
          note={note}
          // backgroundColor = {backgroundColor} //for note background color
          setShowGroups={setShowGroups}
          currentTab={currentTab}
        />
      )}
      {currentTab && <Tab currentTab={currentTab} />}
      <form>
        <textarea
          className='popupNote'
          onChange={(e) => setNote(e.target.value)}
          placeholder='New note'
          value={note}></textarea>
      </form>
      <button className='popup-button save' onClick={handleShowSave}>
        Save
      </button>
    </>
  )
}

export default PopupContent
