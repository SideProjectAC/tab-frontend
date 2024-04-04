import axios from 'axios';

const token = localStorage.getItem("authToken");


const api = axios.create({
  baseURL: 'http://localhost:5050',

   headers: {
    Authorization: `Bearer ${token}`, 
  },
})

export async function fetchGroupsAPI() {
  return api.get('/groups'); 
}
  
export function postNewGroupAPI(newGroupData) { 
  return api.post('/groups',newGroupData)
}

export function updateGroupAPI(groupId, updateData) {
  return api.patch(`/groups/${groupId}`, updateData);
}

export function deleteGroupAPI(groupId) {
  return api.delete(`/groups/${groupId}`);
}