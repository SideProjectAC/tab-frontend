import { useState } from 'react'
import { Group } from './group'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [filteredItem, setFilteredItem] = useState({})

  function handleChange(e) {
    const queryInput = e.target.value.toLowerCase().trim()
    setQuery(queryInput)
    setFilteredItem(group.items.filter((item) => item.includes(e.target.value)))
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder='search for tabs name' />
      <button>icon望遠鏡</button>
      <div>
        <Group key={group.group_id} group={group} />
      </div>
    </div>
  )
}

export default SearchBar

    {
      group.items.map((item) => (
        <div key={item.item_id} draggable onDragStart={(e) => handleDragStart(e, item.item_id, group.group_id)}>
          <TabItem tab={item} groupId={group.group_id} />
        </div>
      ))
    }