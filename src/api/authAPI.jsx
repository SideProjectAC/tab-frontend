import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5050',

})


export function registerAPI(userInfo) { 
  return api.post('/users/register',userInfo)
}

export function loginAPI(userInfo) { 
  return api.post('/users/login',userInfo)
}

export function updateUserAPI( updateUserInfo) {
  return api.patch('/user', updateUserInfo);
}

export function deleteUserAPI() {
  return api.delete('/user');
}