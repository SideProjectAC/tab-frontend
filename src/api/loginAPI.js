import axios from 'axios'

const token = localStorage.getItem('authToken')

const api = axios.create({
  baseURL: 'https://tabcolab.site/api/1.0',

  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export function registerAPI(userInfo) {
  return api.post('/users/register', userInfo)
}

export function loginAPI(userInfo) {
  return api.post('/users/login', userInfo)
}

export function updateUserAPI(updateUserInfo) {
  return api.patch('/user', updateUserInfo)
}

export function deleteUserAPI() {
  return api.delete('/user')
}

export function getUserInfoAPI() {
  return api.get('/user')
}
