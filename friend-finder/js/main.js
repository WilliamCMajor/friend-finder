// Your code here...
(function () {
  menu.addEventListener("click", function (evt) {
    onPureMenuSelected();
    evt.preventDefault();
  });

  document
    .getElementsByClassName("content")[0]
    .addEventListener("click", function (evt) {
      if (evt.target && evt.target.nodeName == "A") {
        const selectedFriendId = evt.target.getAttribute("data-id");
        onSelectFriendItem(selectedFriendId);
      }
      evt.preventDefault();
    });

  function onSelectFriendItem(selectedFriendId) {
    removeOldFriendsList();
    renderFriendDetail(selectedFriendId);
  }

  function onPureMenuSelected() {
    removeOldFriendsList();
    document
      .getElementsByClassName("pure-menu-list")[0]
      .addEventListener("click", function (e) {
        if (e.target && e.target.nodeName == "A") {
          const pureMenuItems = document.getElementsByClassName(
            "pure-menu-item"
          );
          Object.values(pureMenuItems).forEach((item) => {
            if (item.classList.contains(e.target.id)) {
              item.classList.add("pure-menu-selected");
              if (e.target.id == "friends") renderFriendsList();
            } else {
              item.classList.remove("pure-menu-selected");
            }
          });
        }
      });
  }

  const renderFriendDetail = function (friendId) {
    const fetchFriendsRequest = fetch(`./friends/${parseInt(friendId)}.json`);
    fetchFriendsRequest
      .then((response) => response.json())
      .then((friendDetail) => {
        const friendMarkUp = createFriendDetailMarkup(friendDetail);
        displayFriendList(friendMarkUp);
      })
      .catch((error) => console.warn(`Error: ${error}`));
  };

  const createFriendDetailMarkup = function (data) {
    const template = `           
    <div class="friend">
        <div class="identity">
            <img src="img/${data.avatar}" class="photo" />
            <h2 class="name">${
              data.firstName.toLowerCase() + " " + data.lastName.toLowerCase()
            }</h2>
            <ul>
                <li><span class="label">email:</span> ${data.email}</li>
                <li><span class="label">hometown:</span> ${data.hometown}</li>
            </ul>
        </div>
        <p class="bio">
            ${data.bio}
        </p>
    </div>
             `;
    return document
      .createRange()
      .createContextualFragment(template)
      .querySelector("div");
  };

  const renderFriendsList = function () {
    const fetchFriendsRequest = fetch("./friends/friends.json");
    let friendsData = [];
    fetchFriendsRequest
      .then((response) => response.json())
      .then((data) => {
        friendsData = [...data];
        const friendsMarkUp = createFriendListMarkup(friendsData);
        displayFriendList(friendsMarkUp);
      })
      .catch((error) => console.warn(`Error: ${error}`));
  };

  const createFriendListMarkup = function (data) {
    const template = `           
    <div id='friendList' class="pure-menu custom-restricted-width">
        <span class="pure-menu-heading">Friends</span>

        <ul class="pure-menu-list pure-friend-list">
            ${data
              .map(function (friend) {
                return `<li class="pure-menu-item"><a href="#" class="pure-menu-link" data-id=${
                  friend.id
                }">${friend.firstName.toLowerCase() + " " + friend.lastName.toLowerCase()}</a></li>`;
              })
              .join(" ")}
        </ul>
    </div>
             `;
    return document
      .createRange()
      .createContextualFragment(template)
      .querySelector("div");
  };

  const displayFriendList = function (elements) {
    const content = removeOldFriendsList();
    content.appendChild(elements);
  };

  const removeOldFriendsList = function () {
    const content = document.querySelector(".content");
    content.innerHTML = "";
    return content;
  };
})();
