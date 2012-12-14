var views = {};
var currentUser = null;

function submitLogin(e) {
  if (e.preventDefault) e.preventDefault();

  var form = views['form'];
  var url = form.getAttribute('action');
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.onload = function() {
    if (xhr.status == 200) {
      // TODO: it would be better if the authentication returned a success/error json
      getUserAndShowView();
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

function selectRoomOption(option) {
  if (option == 'personal') {
    document.getElementById('room-type-personal').checked = "checked";
  } else {
    document.getElementById('room-type-other').checked = "checked";
  }
}

function onMconfOrgClick(e) {
  properties = { url: "http://mconf.org" };
  chrome.tabs.create(properties);
}

function onClickGo(e) {
  name = document.getElementById('room-name').value
  if (name.trim() != "") {
    goToWebconf(name);
  } else {
    goToWebconf(currentUser.login);
  }
}

function onRoomNameKeyUp(e) {
  name = document.getElementById('room-name').value
  if (e.keyCode == 13) {
    if (name.trim() != "") {
      goToWebconf(name);
    } else {
      goToWebconf(currentUser.login);
    }
  } else {
    if (name.trim() != "") {
      selectRoomOption('other');
    } else {
      selectRoomOption('personal');
    }
  }
}

function onRadioButtonChange(e) {
  if (document.getElementById('room-type-personal').checked) {
    document.getElementById('room-name').value = ""
    document.getElementById('room-name').placeholder = currentUser.login;
  }
  document.getElementById('room-name').focus();
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

function attachAllEvents() {
  // Submitting the form
  var form = views['form'];
  if (form.attachEvent) {
    form.attachEvent("submit", submitLogin);
  } else {
    form.addEventListener("submit", submitLogin);
  }

  // Click in the button to open "other room"
  var btn = document.getElementById('room-go');
  if (btn.attachEvent) {
    btn.attachEvent("click", onClickGo);
  } else {
    btn.addEventListener("click", onClickGo);
  }

  // Selecting a radio button focuses the input text
  btn = document.getElementById('room-type-personal');
  if (btn.attachEvent) {
    btn.attachEvent("change", onRadioButtonChange);
  } else {
    btn.addEventListener("change", onRadioButtonChange);
  }
  btn = document.getElementById('room-type-other');
  if (btn.attachEvent) {
    btn.attachEvent("change", onRadioButtonChange);
  } else {
    btn.addEventListener("change", onRadioButtonChange);
  }

  // Pressing a key in the input
  input = document.getElementById('room-name');
  if (input.attachEvent) {
    input.attachEvent("keyup", onRoomNameKeyUp);
  } else {
    input.addEventListener("keyup", onRoomNameKeyUp);
  }

  // Clicking the mconf.org link
  link = document.getElementById('mconf-org-link');
  if (link.attachEvent) {
    link.attachEvent("click", onMconfOrgClick);
  } else {
    link.addEventListener("click", onMconfOrgClick);
  }
}

function switchVisibleElement(element) {
  console.log('Setting the visible element to', element);
  for(var key in views) {
    if (key == element) {
      views[key].style.display = 'block';
      if (key == 'room-selection') {
        document.getElementById('room-name').focus();
        document.getElementById('room-name').placeholder = currentUser.login;
      }
    } else {
      views[key].style.display = 'none';
    }
  }
}

// Get the current user and shows the appropriate view (login or
// room selection).
function getUserAndShowView() {
  switchVisibleElement('loading');
  getCurrentUser(function(user) {
    currentUser = user;
    if (user) {
      console.log('Logged in, showing room selection');
      switchVisibleElement('room-selection');
    } else {
      console.log('No user logged, showing login form');
      switchVisibleElement('form');
    }
  });
}

window.onload = function() {
  views['form'] = document.getElementById('login-form');
  views['loading'] = document.getElementById('loading');
  views['room-selection'] = document.getElementById('room-selection');

  attachAllEvents();

  getUserAndShowView();
}
