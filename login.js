var form;
var loading;

function submitLogin(e) {
  if (e.preventDefault) e.preventDefault();

  var url = form.getAttribute('action');
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onload = function() {
    if (xhr.status == 200) {
      // TODO: it would be better if the authentication returned a success/error json
      redirectToWebconfIfLoggedIn();
      // TODO: show error to the user if registration failed
    } else {
      // TODO: show error to the user
      console.log('authentication error:', xhr.status);
    }
  };
  xhr.send(new FormData(form));

  return false;
}

function goToWebconf(username) {
  var baseUrl = 'https://mconf.org/bigbluebutton/rooms/%s/join/';
  var url = baseUrl.replace('%s', username);
  console.log('Opening the user\'s conference room at:', url);

  properties = { url: url };
  chrome.tabs.create(properties, function(tab) {
    console.log('Opened tab:', tab);
    // chrome.browserAction.setBadgeText({text: "on"});
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
      if (user.login === undefined) {
        user = null
      }
      done(user);
    } else {
      // TODO
    }
  };
  req.send(null);
}

function attachFormEvents() {
  if (form.attachEvent) {
    form.attachEvent("submit", submitLogin);
  } else {
    form.addEventListener("submit", submitLogin);
  }
}

function switchVisibleElement(element) {
  if (element == 'loading') {
    console.log('Making the loading element visible');
    form.style.display = 'none';
    loading.style.display = 'hidden';
  } else {
    console.log('Making the form visible');
    form.style.display = 'block';
    loading.style.display = 'none';
  }
}

function redirectToWebconfIfLoggedIn() {
  switchVisibleElement('loading');
  getCurrentUser(function(user) {
    if (user) {
      goToWebconf(user.login);
    } else {
      console.log('No user logged, showing login form');
      switchVisibleElement('form');
    }
  });
}

window.onload = function() {
  form = document.getElementById('login-form');
  loading = document.getElementById('loading');

  attachFormEvents();
  redirectToWebconfIfLoggedIn();
}
