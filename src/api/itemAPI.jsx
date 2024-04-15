import axios from 'axios'

const token = localStorage.getItem('authToken')

const api = axios.create({
  baseURL: 'http://localhost:5050',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export async function postTabAPI(groupId, tabData) {
  try {
    const response = await api.post(`/groups/${groupId}/tabs`, tabData)
    // console.log('New tab added to Group successfully:', response.data);
    return response.data
  } catch (error) {
    console.error('Error posting new tab to group:', error)
    throw error
  }
}

export async function postNoteAPI(groupId, noteData) {
  try {
    const response = await api.post(`/groups/${groupId}/notes`, noteData)
    return response.data
  } catch (error) {
    console.error('Error posting new note to group:', error)
    throw error
  }
}

export async function patchNoteAPI(groupId, itemId, noteData) {
  try {
    const response = await api.patch(`/groups/${groupId}/notes/${itemId}`, noteData)
    return response.data
  } catch (error) {
    console.error('Error updating note:', error)
    throw error
  }
}

export async function deleteItemFromGroupAPI(groupId, itemId) {
  try {
    // console.log('in delete api: ', groupId, itemId)
    const response = await api.delete(`/groups/${groupId}/items/${itemId}`)
    // console.log('Item deleted successfully:', response.data);
    return response.data
  } catch (error) {
    console.error('Error deleting item from group:', error)
    throw error
  }
}

export async function patchItemToExistingGroupsAPI(
  groupId,
  itemId,
  targetPosition
) {
  try {
    const response = await api.patch(
      `/groups/${groupId}/items/${itemId}`,
      targetPosition
    )
    console.log('Item moved successfully:', response.data)
    return response.data
  } catch (error) {
    console.error('Error moved item:', error)
    throw error
  }
}
