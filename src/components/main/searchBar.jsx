import { useState } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'
import TabItem from './tabItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

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
      <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon' />
      <input
        type='search'
        value={query}
        onChange={handleChange}
        placeholder='Search for tabs title'
      />
      <div className='matchedItemsContainer'>
        {titleMatchedItems.map((tmi) => (
          <TabItem key={tmi.item_id} tab={tmi} groupId={tmi.group_id} />
        ))}
      </div>
    </div>
  )
}

export default SearchBar
