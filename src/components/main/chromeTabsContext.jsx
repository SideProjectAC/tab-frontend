import  { createContext, useState, useEffect, useContext } from 'react';

const ChromeTabsContext = createContext();

export const ChromeTabsProvider = ({ children }) => {
  const [chromeTabs, setChromeTabs] = useState([]);

    useEffect(() => {
//首次先一次抓
    if (chromeTabs.length === 0 ) {
      chrome.tabs.query({ currentWindow: true }, (fetchedTabs) => {
        const filteredTabs = fetchedTabs.filter(tab => tab.url !== 'chrome-extension://gfledkccocicmdgnjeafbnffcimdfonb/index.html');
        setChromeTabs(filteredTabs);
      });
    }

    const port = chrome.runtime.connect({ name: "tabsUpdate" });
//message的資料貼夠：{action:"",tab:{一堆tab info}} (因background.js)
    port.onMessage.addListener((message) => {
//新增＋更新
      if ( message.action === "tabUpdated" ) {
        setChromeTabs((prevTabs) => {
          const filteredTabs = prevTabs.filter(t => t.id !== message.tab.id);
          return [...filteredTabs, message.tab];
        });

//刪除
      } else if (message.action === "tabRemoved") {
        setChromeTabs((currentTabs) => currentTabs.filter(tab => tab.id !== message.tabId));
      } else if (message.action === "tabMoved") {
//移動位置
        setChromeTabs((prevTabs) => {
          const movedTab = prevTabs.find((tab) => tab.id === message.tabId)
          const filteredTabs = prevTabs.filter(tab => tab.id !== message.tabId);
          return [
            ...filteredTabs.slice(0, message.newIndex),
            movedTab,
            ...filteredTabs.slice(message.newIndex)
          ];
        })
      }
    
    });
    
    return () => port.disconnect();
  },[]);

  return (
    <ChromeTabsContext.Provider value={{ chromeTabs, setChromeTabs }}>
      {children}
    </ChromeTabsContext.Provider>
  );
}
 
export const useChromeTabs = () => useContext(ChromeTabsContext);
