import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5050',

  //FIX: https://is.gd/kFFVb4 有需要加上這個 headers 嗎？
  headers: {
    Authorization: 'Bearer YOUR_TOKEN_HERE', //??
  },
})

export async function getItemsByKeywordAPI({ query, item_type }) {
  try {
    const response = await api.get(
      `/groups/items/search?keyword=${query}&itemTypes=${item_type}`
    )
    console.log('Item for search been get ')
    return response.data
  } catch (error) {
    console.error('Error get Item for search', error)
    throw error
  }
}
