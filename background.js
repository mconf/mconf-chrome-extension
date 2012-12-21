var tabs = {};

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  console.log("tab closed", tabId);
  if (tabs[tabId] !== 'undefined') {
    delete tabs[tabId];
    updateBadge();
    views = chrome.extension.getViews({type: 'popup'});
    for (var i = 0; i < views.length; i++) {
      views[i].updateTabList(tabs);
    }
  }
});

function tabOpened(tab) {
  tabs[tab.id] = tab;
  updateBadge();
  views = chrome.extension.getViews({type: 'popup'});
  for (var i = 0; i < views.length; i++) {
    views[i].updateTabList(tabs);
  }
}

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

function updateBadge() {
  if (Object.size(tabs) > 0) {
    chrome.browserAction.setBadgeText({text: "on"});
  } else {
    chrome.browserAction.setBadgeText({text: ""});
  }
}
