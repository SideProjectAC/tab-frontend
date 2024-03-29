import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5050',

  //FIX: https://is.gd/kFFVb4 有需要加上這個 headers 嗎？
  headers: {
    Authorization: 'Bearer YOUR_TOKEN_HERE', //??
  },
})

export async function getItemsByKeywordAPI(query) {
  try {
    const response = await api.get(
      `/groups/items/search?keyword=${query}&itemTypes=0`
    )
    console.log('Item for search been get ')
    console.log(response.data)
    return response.data
  } catch (error) {
    console.error('Error get Item for search', error)
    throw error
  }
}
