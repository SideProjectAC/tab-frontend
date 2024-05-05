import { useState } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'
import TabItem from './tabItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const debouncedHandleChange = debounce(async (value, setTitleMatchedItems) => {
  if (value === '') {
    setTitleMatchedItems([])
    // setNoResult(false)
    return
  }
  try {
    //TODO:設置item_type 參數在state（可考慮用物件儲存query與item_type）
    const titleMatchedItems = await getItemsByKeywordAPI(value)
    setTitleMatchedItems(titleMatchedItems)
  } catch (error) {
    console.error(error)
  }
})

function debounce(fn, delay = 500) {
  let timer

  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

function SearchBar() {
  const [query, setQuery] = useState('')
  const [titleMatchedItems, setTitleMatchedItems] = useState([])

  const handleChange = (e) => {
    const value = e.target.value
    setQuery(value)
    debouncedHandleChange(value, setTitleMatchedItems)
  }

  return (
    <div className='searchBar'>
      <div className='searchInputContainer'>
        <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon' />
        <input
          type='search'
          value={query}
          onChange={handleChange}
          placeholder='Search for tabs title'
        />
      </div>
      <div className='searchResultsContainer'>
        {titleMatchedItems.map((tmi) => (
          <TabItem
            className='searchResultsStyle'
            key={tmi.item_id}
            tab={tmi}
            groupId={tmi.group_id}
          />
        ))}
      </div>
    </div>
  )
}

export default SearchBar
