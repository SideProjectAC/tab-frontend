import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050',

  headers: {
    Authorization: 'Bearer YOUR_TOKEN_HERE', //??
  },
});


export async function PostTabAPI(groupId, tabData) {
  console.log("new group: ", groupId, tabData)
  try {
    const response = await api.post(`/groups/${groupId}/tabs`, tabData);
    // console.log('New tab added to Group successfully:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error posting new tab to group:', error);
    throw error; 
  }
}

export async function DeleteItemFromGroupAPI(groupId, itemId) {
  try {
    console.log("in delete api: ", groupId, itemId)
    const response = await api.delete(`/groups/${groupId}/items/${itemId}`);
    // console.log('Item deleted successfully:', response.data);
    return response.data; 
  } catch (error) {
    console.error('Error deleting item from group:', error);
    throw error; 
  }
}