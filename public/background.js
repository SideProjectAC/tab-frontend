

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "tabsUpdate");
//新增
  // const tabCreatedListener = (tab) => {
  //   chrome.tabs.get(tab.id, (newTab) => {
  //     // port.postMessage({ action: "tabCreated", tab: newTab });
  //   });
  // };

//更新
  const tabUpdatedListener = (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      chrome.tabs.get(tabId, (updatedTab) => {
          port.postMessage({ action: "tabUpdated", tab: updatedTab });
      });
    }
  };
//刪除
  const tabRemovedListener = (tabId, removeInfo) => {
    port.postMessage({ action: "tabRemoved", tabId: tabId });
  };
//移動位置

  const tabMovedListener = (tabId,moveInfo) => {
    port.postMessage({action:"tabMoved",tabId:tabId, newIndex: moveInfo.toIndex })
  }

  chrome.tabs.onCreated.addListener();
  chrome.tabs.onUpdated.addListener(tabUpdatedListener);
  chrome.tabs.onRemoved.addListener(tabRemovedListener);
  chrome.tabs.onMoved.addListener(tabMovedListener);

  port.onDisconnect.addListener(() => {
    chrome.tabs.onCreated.removeListener();
    chrome.tabs.onUpdated.removeListener(tabUpdatedListener);
    chrome.tabs.onRemoved.removeListener(tabRemovedListener);
    chrome.tabs.onMoved.removeListener(tabMovedListener);
  });
});


