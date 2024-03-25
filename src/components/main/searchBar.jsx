import { useState } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'

const dummyData = [
  {
    id: 1,
    title: 'title1',
    text: 'test',
  },
  {
    id: 2,
    title: 'title2',
    text: 'test2',
  },
]

function SearchBar() {
  const [query, setQuery] = useState('')
  const [filteredItem, setFilteredItem] = useState([])

  function handleChange(e) {
    setQuery(e.target.value.toLowerCase().trim())
  }

  // function handleSearch() {
  //   setFilteredItem(
  //     dummyData.filter(
  //       ({ title, text }) =>
  //         title.toLowerCase().includes(query) ||
  //         text.toLowerCase().includes(query)
  //     )
  //   )
  // }

  async function handleSearch() {
    try {
      const item = await getItemsByKeywordAPI({ query, item_type }) //TODO:設置item_type 參數在state（可考慮用物件儲存query與item_type）
      console.log(item.match)
      console.log(item.match[1])

      // setFilteredItem(
      //   item.matchfilter
      // )
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={handleChange}
        placeholder='search for tabs name'
      />
      <button onClick={handleSearch}>icon望遠鏡</button>
      <div>
        {filteredItem.map((fi) => (
          <li key={fi.id}>{fi.id}</li>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
