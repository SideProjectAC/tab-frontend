import { useState, useEffect } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'
import TabItem from './tabItem'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useDebounceWithStatus } from './Library/hook/useDebounce'

function SearchBar() {
  const [titleMatchedItems, setTitleMatchedItems] = useState([])
  const [query, setQuery] = useState('')
  const [debouncedQuery, isDebouncing] = useDebounceWithStatus(query, 500)
  const handleChange = async (value) => {
    if (value === '') {
      setTitleMatchedItems([])
      return
    }
    try {
      const titleMatchedItems = await getItemsByKeywordAPI(value)
      setTitleMatchedItems(titleMatchedItems)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleChange(debouncedQuery)
  }, [debouncedQuery])

  return (
    <div className='searchBar'>
      <div className='searchInputContainer'>
        <FontAwesomeIcon icon={faMagnifyingGlass} className='searchIcon' />
        <input
          type='search'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
