import { useState, useEffect } from 'react'
import { useDebounceWithStatus } from '../context/hook/useDebounce'
import { useGroups } from '../context/GroupContext'
import {
  postNoteAPI,
  patchNoteAPI,
  deleteItemFromGroupAPI,
  patchTodoAPI,
} from '../../api/itemAPI'
import noteItemPropTypes from 'prop-types'
import '../../scss/main/note.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faNoteSticky } from '@fortawesome/free-solid-svg-icons'

function Note({ item, groupId }) {
  const { setGroups } = useGroups()
  const [noteContent, setNoteContent] = useState(item?.note_content || '')
  const [noteType, setNoteType] = useState(item?.item_type || 1) //TODO 需要預設為1就好嗎？
  const noteItemClass = noteContent ? 'noteItem' : 'new-noteItem'
  const noteBgColor = '#f7f7f7' //暫無變換顏色功能
  const [todoDoneStatus, setTodoDoneStatus] = useState(
    item?.doneStatus || false
  )
  const [debouncedNoteContent, isDebouncing] = useDebounceWithStatus(
    noteContent,
    500
  )
  const [isInitRender, setIsInitRender] = useState(true)

  // 更改 DoneStatus 時，打 api 給後端
  useEffect(() => {
    if (isInitRender) {
      setIsInitRender(false)
      return
    }
    if (noteType === 2 && item) {
      const patchDoneStatus = { doneStatus: todoDoneStatus }
      try {
        patchTodoAPI(groupId, item?.item_id, patchDoneStatus)
      } catch (error) {
        console.log('Error patching done status:', error)
      }
    } else return
  }, [todoDoneStatus])

  // 更改 noteContent 時，在 debounce 後打 api 給後端
  useEffect(() => {
    if (isInitRender) {
      setIsInitRender(false)
      return
    }
    if (debouncedNoteContent !== item?.note_content) {
      handleChangeItemContent()
    }
  }, [debouncedNoteContent])

  const handleChangeItemContent = async () => {
    if (!item) {
      handleAddNote()
    } else {
      noteType === 1 ? handlePatchNoteContent() : handlePatchTodoContent()
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleChangeItemContent()
    }
  }

  const handleAddNote = async () => {
    if (noteContent === '') {
      return
    }
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

  const handlePatchNoteContent = async () => {
    const patchNoteContent = { note_content: noteContent }
    try {
      await patchNoteAPI(groupId, item?.item_id, patchNoteContent) //todo 參數三個以上時，把參數改成object，避免undefined參數導致參照錯誤
    } catch (error) {
      console.log('Error patching note:', error)
    }
  }
  const handlePatchTodoContent = async () => {
    const patchTodoContent = { note_content: noteContent }
    try {
      await patchTodoAPI(groupId, item?.item_id, patchTodoContent)
    } catch (error) {
      console.log('Error patching todo:', error)
    }
  }
  const handlePatchItemType = async () => {
    try {
      const newNoteType = noteType === 1 ? 2 : 1
      const patchAPI = noteType === 1 ? patchNoteAPI : patchTodoAPI
      const patchNoteType = { item_type: newNoteType }

      await patchAPI(groupId, item?.item_id, patchNoteType)
      console.log(
        `Patch ${
          newNoteType === 1 ? 'note' : 'todo'
        } type request sent successfully.`
      )

      setNoteType(newNoteType)
    } catch (error) {
      console.log('Error patching item type:', error)
    }
  }
  const handleDeleteItem = async (groupId) => {
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
      <div
        key={item?.item_id}
        className={noteItemClass}
        // style={{ backgroundColor: item?.note_bgColor }} //暫無變換顏色功能因此使用scss即可
      >
        {item && (
          <button className='switchNoteButton' onClick={handlePatchItemType}>
            {noteType === 1 && <FontAwesomeIcon icon={faNoteSticky} />}
            {noteType === 2 && <FontAwesomeIcon icon={faCircleCheck} />}
          </button>
        )}
        {noteType === 2 && (
          <input
            className='CheckBox'
            type='checkbox'
            checked={todoDoneStatus}
            onClick={(e) => setTodoDoneStatus(e.target.checked)}></input>
        )}
        <textarea
          className={
            noteType === 1 ? 'note' : todoDoneStatus ? 'checkedTodo' : 'todo'
          }
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          onKeyDown={handleKeyDown}
          // style={{ backgroundColor: item?.note_bgColor }} //暫無變換顏色功能因此使用scss即可
        ></textarea>
        {item && (
          <div>
            <button
              className='deleteButton'
              onClick={() => {
                handleDeleteItem(groupId)
              }}>
              x
            </button>
          </div>
        )}
      </div>
    </>
  )
}

Note.propTypes = noteItemPropTypes

export default Note
