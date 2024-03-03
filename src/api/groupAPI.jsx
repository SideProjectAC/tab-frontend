import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050',

  headers: {
    Authorization: 'Bearer YOUR_TOKEN_HERE',
  },
});

export function fetchGroupsAPI() {
  api.get('/groups')
  .then(response => {
    console.log(response.data); 
  })
  .catch(error => {
    console.error(error); 
  });
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