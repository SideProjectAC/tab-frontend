import { useState } from 'react'
import { getItemsByKeywordAPI } from '../../api/searchAPI'

import { itemPropTypes } from './propTypes'
import '../../scss/main/tabItem.scss'

function PartialTabItem({ browserTab_url, browserTab_title, windowId, key }) {
  const activateTab = async () => {
    await chrome.tabs.create({ url: browserTab_url, active: false })
    await chrome.windows.update(windowId, { focused: true })
  }

  function getFaviconURL(u) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'))
    url.searchParams.set('pageUrl', u)
    url.searchParams.set('size', '32')
    return url.toString()
  }
  const favIconUrl = getFaviconURL(browserTab_url)

  return (
    <>
      <li key={key} className='tabItem' onClick={activateTab}>
        <img src={favIconUrl} alt='Favicon' className='tabIcon' />
        <div className='tabText'>
          <h3>{browserTab_title}</h3>
          <p>{browserTab_url}</p>
        </div>
      </li>
    </>
  )
}
PartialTabItem.propTypes = itemPropTypes

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
        {titleMatchedItems.map((tmi) => (
            <PartialTabItem
              key={tmi.browserTab_id}
              browserTab_url={tmi.browserTab_url}
              browserTab_title={tmi.browserTab_title}
              browserTab_id={tmi.browserTab_id}
              windowId={tmi.windowId}
            />
        ))}
      </div>
    </div>
  )
}

export default SearchBar
