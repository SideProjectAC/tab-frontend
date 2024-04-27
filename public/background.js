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
    if (changeInfo.status === "complete") {
      chrome.tabs.get(tabId, (tab) => {
        // const tabInfo = {
        //   browserTab_id : updatedTab.id,
        //   browserTab_favIconUrl: updatedTab.favIconUrl,
        //   browserTab_title: updatedTab.title,
        //   browserTab_url: updatedTab.url,
        //   browserTab_active: updatedTab.active,
        //   browserTab_groupId: updatedTab.groupId,
        //   browserTab_index: updatedTab.index,
        //   browserTab_status: updatedTab.status,
        // }
        port.postMessage({ action: "tabUpdated", tab: tab });
      });
    }
  };
  //刪除
  const tabRemovedListener = (tabId, removeInfo) => {
    port.postMessage({ action: "tabRemoved", tabId: tabId });
  };
  //移動位置

  const tabMovedListener = (tabId, moveInfo) => {
    port.postMessage({
      action: "tabMoved",
      tabId: tabId,
      newIndex: moveInfo.toIndex,
    });
  };

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

//oauth

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "authenticate") {
    const redirectUri = chrome.identity.getRedirectURL();
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=560502229224-mi0fugbocfd28g611gsrhsmrai6l5ird.apps.googleusercontent.com&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=profile%20email`;
    // console.log(
    //   "Redirect URI in OAuth request:",
    //   decodeURIComponent(authUrl.split("redirect_uri=")[1].split("&")[0])
    // );

    chrome.identity.launchWebAuthFlow(
      { url: authUrl, interactive: true },
      (responseUrl) => {
        const url = new URL(responseUrl);
        const code = url.searchParams.get("code");
        sendResponse({ code: code });
      }
    );
    return true;
  }
});
