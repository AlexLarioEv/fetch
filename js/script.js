class View {
  constructor() {
    this.app = document.getElementById("app");
    this.input = app.querySelector(".b-input");
    this.listFind = app.querySelector(".b-input__list");
    this.listUsers = document.querySelector(".b-list");
    this.searchInput = app.querySelector(".search-input");
  }
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }
  createUser(userData) {
    const userElement = this.createElement("button", "b-input__el");
    userElement.addEventListener("click", () => {
      this.searchInput.value = "";
      this.listFind.innerHTML = "";
      const card = this.createCard(userData);
      const buttonClouse = card.querySelector(".b-list__button");
      buttonClouse.addEventListener("click", () => card.remove());
    });
    userElement.innerHTML = `<span class="b-list__name">${userData.name} </span>`;
    this.listFind.append(userElement);
  }

  createCard(userData) {
    const elementList = this.createElement("div", "b-list__el");
    elementList.innerHTML = `<ul class="b-list__list"> 
                              <li>Name:${userData.name}</li>
                              <li>Owner:${userData.owner.login}</li>
                              <li>Stars:${userData.stargazers_count}</li>
                            </ul>
                            <button class = "b-list__button">
                              <img src="img/cross-mark-304374.svg" alt="Clouse">
                            </button>`;
    this.listUsers.append(elementList);
    return elementList;
  }
}

const USERS_PER_PAGE = 5;

class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchUsers.bind(this), 500),
    );
  }

  async searchUsers() {
    this.clearUsers();
    if (this.view.searchInput.value) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${this.view.searchInput.value}&per_page=${USERS_PER_PAGE}`,
      ).then(res => {
        if (res.ok) {
          res.json().then(res => {
            res.items.forEach(user => {
              this.view.createUser(user);
            });
          });
        } else {
        }
      });
    } else {
      this.clearUsers();
    }
  }

  clearUsers() {
    this.view.listFind.innerHTML = "";
  }

  debounce(callee, timeoutMs) {
    return function perform(...args) {
      let previousCall = this.lastCall;
      this.lastCall = Date.now();
      if (previousCall && this.lastCall - previousCall <= timeoutMs) {
        clearTimeout(this.lastCallTimer);
      }
      this.lastCallTimer = setTimeout(() => callee(...args), timeoutMs);
    };
  }
}

new Search(new View());
