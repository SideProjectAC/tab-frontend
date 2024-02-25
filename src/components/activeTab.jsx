import '../styles/activeTab.css'
import TabItem from './tabItem';
// import  { useState, useEffect } from 'react';
import { useActiveTabs } from './activeTabsContext'

const ActiveTabList = () => {
  // const [tabs, setTabs] = useState([]);  
 
 // 直接用query 一次抓所有的active tabs
  // useEffect(() => {
  //   const fetchTabs = async () => {
  //     const response = await new Promise((resolve) => {
  //       chrome.runtime.sendMessage({ action: 'getAllTabs' }, (response) => {
  //         resolve(response.tabs);
  //       });
  //     });
  //     setTabs(response);
  //   };
  //   fetchTabs();
  // });

//   useEffect(() => {
// //首次先一次抓
//     if (tabs.length === 0) {
//       chrome.tabs.query({ currentWindow: true }, (fetchedTabs) => {
//         setTabs(fetchedTabs);
//       });
//     }

//     const port = chrome.runtime.connect({ name: "tabsUpdate" });

//     port.onMessage.addListener((message) => {
// //新增＋更新
//       if ( message.action === "tabUpdated" ) {
//         setTabs((prevTabs) => {
//           const filteredTabs = prevTabs.filter(t => t.id !== message.tab.id);
//           return [...filteredTabs, message.tab];
//         });
// //刪除
//       } else if (message.action === "tabRemoved") {
//         setTabs((currentTabs) => currentTabs.filter(tab => tab.id !== message.tabId));
//       } else if (message.action === "tabMoved") {
// //移動位置
//         setTabs((prevTabs) => {
//           const movedTab = prevTabs.find((tab) => tab.id === message.tabId)
//           const filteredTabs = prevTabs.filter(tab => tab.id !== message.tabId);
//           return [
//             ...filteredTabs.slice(0, message.newIndex),
//             movedTab,
//             ...filteredTabs.slice(message.newIndex)
//           ];
//         })
//       }
    
//     });
    
//     return () => port.disconnect();
//   },[]);
  const {tabs} = useActiveTabs()

  return (
    <ul>
      {tabs.map((tab) => (
        <TabItem key={tab.id} tab={tab} /> // Use tab.id for key if available
      ))} 
    </ul>
  );
}

const ActiveTab = () => {
  return (
    <div>
      <h1>Google Dev Docs</h1>
      <ActiveTabList/>
    </div>
  );
}


export default ActiveTab
