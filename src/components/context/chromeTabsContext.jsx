import { createContext, useState, useEffect, useContext } from 'react'
import { ChromeTabsProviderPropTypes } from '../propTypes/propTypes'

const chromeTabsContext = createContext()

export const ChromeTabsProvider = ({ children }) => {
  const [chromeTabs, setChromeTabs] = useState([])

  useEffect(() => {
    //首次先一次抓
    if (chromeTabs.length === 0) {
      chrome.tabs.query({ currentWindow: true }, (fetchedTabs) => {
        //先過濾掉專案的這個tab
        const filteredTabs = fetchedTabs.filter(
          (tab) =>
            !tab.url.startsWith('chrome://newtab/') &&
            !tab.url.startsWith('chrome://extensions/')
        )

        //一般來說chrome tab會給一堆tab info，但我們只存需要的資料
        const updatedFetchedTabs = filteredTabs.map((tab) => {
          const {
            active,
            favIconUrl,
            id,
            title,
            url,
            windowId,
            index,
            status,
          } = tab
          const updatedTab = {}
          updatedTab.browserTab_active = active
          updatedTab.browserTab_favIconURL = favIconUrl
          updatedTab.browserTab_id = id
          updatedTab.browserTab_title = title
          updatedTab.browserTab_url = url
          updatedTab.windowId = windowId
          updatedTab.browserTab_index = index
          updatedTab.browserTab_status = status
          return updatedTab
        })

        setChromeTabs(updatedFetchedTabs)
      })
    }

    const port = chrome.runtime.connect({ name: 'tabsUpdate' })
    port.onMessage.addListener((message) => {
      //新增＋更新tab
      if (message.action === 'tabUpdated') {
        const updatedTab = {
          browserTab_active: message.tab.active,
          browserTab_favIconURL: message.tab.favIconUrl,
          browserTab_id: message.tab.id,
          browserTab_title: message.tab.title,
          browserTab_url: message.tab.url,
          browserTab_index: message.tab.index,
          windowId: message.tab.windowId,
          browserTab_status: message.tab.status,
        }
        setChromeTabs((prevTabs) => {
          const filteredTabs = prevTabs.filter(
            (tab) => tab.browserTab_id !== message.tab.id
          )
          return [...filteredTabs, updatedTab]
        })

        //刪除tab
      } else if (message.action === 'tabRemoved') {
        setChromeTabs((currentTabs) =>
          currentTabs.filter((tab) => tab.browserTab_id !== message.tabId)
        )
      } else if (message.action === 'tabMoved') {
        //移動位置tab
        setChromeTabs((prevTabs) => {
          const movedTab = prevTabs.find(
            (tab) => tab.browserTab_id === message.tabId
          )
          const filteredTabs = prevTabs.filter(
            (tab) => tab.browserTab_id !== message.tabId
          )
          return [
            ...filteredTabs.slice(0, message.newIndex),
            movedTab,
            ...filteredTabs.slice(message.newIndex),
          ]
        })
      }
    })

    return () => port.disconnect()
  }, [chromeTabs.length])

  return (
    <chromeTabsContext.Provider value={{ chromeTabs, setChromeTabs }}>
      {children}
    </chromeTabsContext.Provider>
  )
}

//Review this and corresponding new import
ChromeTabsProvider.propTypes = ChromeTabsProviderPropTypes

export const useChromeTabs = () => useContext(chromeTabsContext)
