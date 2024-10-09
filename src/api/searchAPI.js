import axios from 'axios'

const token = localStorage.getItem('authToken')

const api = axios.create({
  baseURL: 'https://tabcolab.site/api/1.0',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})

export async function getItemsByKeywordAPI(query) {
  try {
    const response = await api.get(
      `/groups/items/search?keyword=${query}&itemTypes=0`
    )
    // console.log("Item for search been get ");
    // console.log(response.data);
    return response.data
  } catch (error) {
    console.error('Error get Item for search', error)
    throw error
  }
}
