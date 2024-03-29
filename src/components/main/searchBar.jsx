import { useState } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'
import TabItem from './tabItem'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [titleMatchedItems, setTitleMatchedItems] = useState([])

  async function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    if (value === '') {
      setTitleMatchedItems([])
      // setNoResult(false)
      return
    }
    try {
      //TODO:設置item_type 參數在state（可考慮用物件儲存query與item_type）
      // 現 API 會回傳符合 title 與 url 的 item，目前功能只需要搜尋 title
      const titleMatchedItems = (await getItemsByKeywordAPI(value)).filter(
        (item) => item.browserTab_title.includes(value)
      )
      setTitleMatchedItems(titleMatchedItems)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='searchBar'>
      <input
        value={query}
        onChange={handleChange}
        placeholder='search for tabs name'
      />
      <div className='matchedItemsContainer'>
        {titleMatchedItems.map((mi) => (
          <li key={mi.browserTab_id} className='tabItem'>
            <TabItem tab={mi} groupId={mi.group_id} />
          </li>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
