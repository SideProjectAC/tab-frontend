import axios from 'axios'

const token = localStorage.getItem('authToken')

const api = axios.create({
  baseURL: 'http://localhost:5050',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export async function postNoteAPI(group_id, newNoteData) {
  return api.post(`/groups/${group_id}/notes`, newNoteData)
}
