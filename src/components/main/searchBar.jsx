import { useState } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'
import TabItem from './tabItem'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [matchedItems, setMatchedItems] = useState([])
  // const [noResult, setNoResult] = useState(false)

  async function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    if (value === '') {
      setMatchedItems([])
      // setNoResult(false)
      return
    }
    try {
      const matchedItems = await getItemsByKeywordAPI({ query }) //TODO:設置item_type 參數在state（可考慮用物件儲存query與item_type）
      console.log(matchedItems)
      // if (matchedItems.match.length === 0) {
      //   setMatchedItems([])
      //   setNoResult(true)
      // }
      setMatchedItems(matchedItems)
      // setNoResult(false)
    } catch (error) {
      // if (error.response.status === 404) {
      //   setMatchedItems([])
      //   setNoResult(true)
      // }
      console.error(error)
    }
  }

  return (
    <div className="searchBar">
      <input
        value={query}
        onChange={handleChange}
        placeholder='search for tabs name'
      />
      <div className='matchedItemsContainer'>
        {matchedItems.map((mi) => (
          <li key={mi.browserTab_id} className='tabItem'>
            <TabItem tab={mi} groupId={mi.group_id} />
          </li>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
