function goToWebconf(username) {
  var baseUrl = 'https://mconf.org/bigbluebutton/rooms/%s/join/';
  var url = baseUrl.replace('%s', username);
  properties = { url: url };
  chrome.tabs.create(properties, function(tab) {
    console.log('Opened tab:', tab);
  });
}

function getCurrentUser(done) {
  console.log('Fetching the current user');
  var req = new XMLHttpRequest();
  req.open("GET", "https://mconf.org/users/current.json", true);
  req.onload = function() {
    if (req.status == 200) {
      user = JSON.parse(req.responseText);
      console.log('Fetched user', JSON.stringify(user));
      done(user);
    } else {
      // TODO
    }
  };
  req.send(null);
}

function onClicked() {
  getCurrentUser(function(user) {
    if (user.login !== undefined) {
      goToWebconf(user.login);
    } else {
      // TODO
    }
  });
}

chrome.browserAction.onClicked.addListener(onClicked);
