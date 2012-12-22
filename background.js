// Background page used to keep track of the tabs that were
// opened using this extension.

var tabs = {};

// Listens for tab closes to remove the tabs from the local list.
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  if (tabs[tabId] !== 'undefined') {
    delete tabs[tabId];
    updateBadge();
    views = chrome.extension.getViews({type: 'popup'});
    for (var i = 0; i < views.length; i++) {
      views[i].updateTabList(tabs);
    }
  }
});

// Called when a tab is opened to save it locally.
function tabOpened(tab) {
  tabs[tab.id] = tab;
  updateBadge();
  views = chrome.extension.getViews({type: 'popup'});
  for (var i = 0; i < views.length; i++) {
    views[i].updateTabList(tabs);
  }
}

// Updates the badge in the extension icon.
function updateBadge() {
  if (Object.size(tabs) > 0) {
    chrome.browserAction.setBadgeText({text: "!"});
  } else {
    chrome.browserAction.setBadgeText({text: ""});
  }
}

// Returns all tabs opened.
function getTabs() {
  return tabs;
}

// Returns the tab with id `id` if it exists.
function getTab(id) {
  return tabs[id];
}

Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
