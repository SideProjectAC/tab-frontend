import { useState, useEffect } from 'react'
import '../../scss/main/note.scss'
import {
  postNoteAPI,
  patchNoteAPI,
  deleteItemFromGroupAPI,
  patchTodoAPI,
} from '../../api/itemAPI'
import { useGroups } from '../useContext/GroupContext'
import noteItemPropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faNoteSticky } from '@fortawesome/free-solid-svg-icons'

function Note({ item, groupId }) {
  const { setGroups } = useGroups()
  const [noteContent, setNoteContent] = useState(item?.note_content || '')
  const [noteType, setNoteType] = useState(item?.item_type || 1) //TODO 需要預設為1就好嗎？
  const [todoDoneStatus, setTodoDoneStatus] = useState(
    item?.doneStatus || false
  )
  const noteItemClass = !noteContent ? 'new-noteItem' : 'noteItem'
  const noteBgColor = '#f7f7f7' //暫無變換顏色功能

  //Fix console.log API response and error
  useEffect(() => {
    if (noteType === 2 && item && item.item_id && groupId) {
      const patchDoneStatus = { doneStatus: todoDoneStatus }
      console.log('Patch Done Status:', patchDoneStatus) // Add this log statement
      try {
        patchTodoAPI(groupId, item?.item_id, patchDoneStatus)
          .then((response) => console.log('Patch Todo API Response:', response)) // Add this log statement
          .catch((error) =>
            console.error('Error patching todo -> note:', error)
          ) // Add this catch statement
      } catch (error) {
        console.log('Error patching done status:', error)
      }
    }
  }, [todoDoneStatus, noteType, item, groupId])

  //Fix 原版
  // useEffect(() => {
  //   if (noteType === 2 && item && item.item_id && groupId) {
  //     const patchDoneStatus = { doneStatus: todoDoneStatus }
  //     try {
  //       patchTodoAPI(groupId, item?.item_id, patchDoneStatus)
  //     } catch (error) {
  //       console.log('Error patching done status:', error)
  //     }
  //   } else return
  // }, [todoDoneStatus])

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
  const handleChangeItemContent = (event) => {
    //todo 用 useMemo 來優化 return 一個 callback function
    event.key !== 'Enter'
      ? setNoteContent(event.target.value)
      : // 編輯 note 內容而不是按下 Enter 鍵
        (() => {
          event.preventDefault()
          // 如果是現存的 item
          item
            ? // 如果是 note
              noteType === 1
              ? handlePatchNoteContent()
              : // 如果是 todo
                handlePatchTodoContent()
            : // 如果是新的 item
              handleAddNote()
        })()
  }
  const handlePatchNoteContent = async () => {
    const patchNoteContent = { note_content: noteContent }
    // console.log(groupId, item)
    try {
      await patchNoteAPI(groupId, item?.item_id, patchNoteContent) //todo 參數三個以上時，把參數改成object，避免undefined參數導致參照錯誤
    } catch (error) {
      console.log('Error patching note:', error)
    }
  }
  const handlePatchTodoContent = async () => {
    //todo 現：不管是note還是todo都是改noteContent，應改為改 todoContent（潛在問題：輸入 content 到一半按下切換鈕）
    const patchTodoContent = { note_content: noteContent }
    try {
      await patchTodoAPI(groupId, item?.item_id, patchTodoContent)
    } catch (error) {
      console.log('Error patching todo:', error)
    }
  }
  //FIX 這個版本可以快速切換，但是不一定能打出正確 API
  // const handlePatchNoteType = async () => {
  //   const patchAPI = noteType === 1 ? patchNoteAPI : patchTodoAPI
  //   const newNoteType = noteType === 1 ? 2 : 1
  //   setNoteType(newNoteType)
  //   const patchNoteType = { item_type: newNoteType }
  //   try {
  //     // console.log(groupId, item?.item_id, patchNoteType)
  //     await patchAPI(groupId, item.item_id, patchNoteType)
  //     console.log(
  //       `Patch ${
  //         noteType === 1 ? 'note' : 'todo'
  //       } type request sent successfully.`
  //     )
  //   } catch (error) {
  //     console.log('Error patching item type:', error)
  //   }
  // }

  //FIX 這個版本只有正確打出 API 才可以自由切換
  const handlePatchItemType = async () => {
    try {
      noteType === 1
        ? await handlePatchNoteContent()
        : await handlePatchTodoContent()

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
  // const handlePatchDoneStatus = async (e) => {
  //   console.log('check status:', e.target.checked)
  //   setTodoDoneStatus(e.target.checked)
  //   // const patchDoneStatus = { doneStatus: todoDoneStatus }
  //   // try {
  //   //   await patchTodoAPI(groupId, item?.item_id, patchDoneStatus)
  //   //   console.log(item)
  //   // } catch (error) {
  //     // console.log('Error patching done status:', error)
  //   // }
  // }
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
            noteType === 1
              ? 'note'
              : todoDoneStatus === true
              ? 'checkedTodo'
              : 'todo'
          }
          value={noteContent}
          onChange={handleChangeItemContent}
          onKeyDown={handleChangeItemContent}
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
