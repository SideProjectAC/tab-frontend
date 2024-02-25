import  { createContext, useState, useEffect, useContext } from 'react';

const ActiveTabsContext = createContext();

export const ActiveTabsProvider = ({ children }) => {
  const [tabs, setTabs] = useState([]);

    useEffect(() => {
//首次先一次抓
    if (tabs.length === 0) {
      chrome.tabs.query({ currentWindow: true }, (fetchedTabs) => {
        setTabs(fetchedTabs);
      });
    }

    const port = chrome.runtime.connect({ name: "tabsUpdate" });

    port.onMessage.addListener((message) => {
//新增＋更新
      if ( message.action === "tabUpdated" ) {
        setTabs((prevTabs) => {
          const filteredTabs = prevTabs.filter(t => t.id !== message.tab.id);
          return [...filteredTabs, message.tab];
        });
//刪除
      } else if (message.action === "tabRemoved") {
        setTabs((currentTabs) => currentTabs.filter(tab => tab.id !== message.tabId));
      } else if (message.action === "tabMoved") {
//移動位置
        setTabs((prevTabs) => {
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
    <ActiveTabsContext.Provider value={{ tabs, setTabs }}>
      {children}
    </ActiveTabsContext.Provider>
  );
}
 
export const useActiveTabs = () => useContext(ActiveTabsContext);
