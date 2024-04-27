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

function authenticate(callback) {
  chrome.identity.getAuthToken({ interactive: true }, (token) => {
    if (chrome.runtime.lastError) {
      console.error("Authentication failed: ", chrome.runtime.lastError);
      callback(null);
    } else {
      callback(token);
    }
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "authenticate") {
    authenticate((token) => {
      sendResponse({ token: token });
    });
    return true;
  }
});

//log out test
// Function to remove the cached token and revoke it
function logout(callback) {
  chrome.identity.getAuthToken({ interactive: false }, function (token) {
    if (chrome.runtime.lastError) {
      console.error("Error fetching auth token:", chrome.runtime.lastError);
    } else {
      // Remove the token from the cache
      chrome.identity.removeCachedAuthToken({ token: token }, () => {
        console.log("Token removed from cache.");
        // Optionally, revoke the token on Google's servers
        const revokeUrl = `https://accounts.google.com/o/oauth2/revoke?token=${token}`;
        fetch(revokeUrl).then(() => {
          console.log("Token revoked.");
          callback();
        });
      });
    }
  });
}

// Listen for a logout message from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "logout") {
    logout(() => {
      sendResponse({ success: true });
    });
    return true; // Indicates you're sending a response asynchronously
  }
});
