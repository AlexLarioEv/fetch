const app = document.getElementById("app");
const input = document.querySelector(".b-input");
const listFind = document.querySelector(".b-input__list");
const listUsers = document.querySelector(".b-list");
const searchInput = document.querySelector(".search-input");
const USERS_PER_PAGE = 5;

class View {
  constructor(app, input, listFind, listUsers, searchInput) {
    this.app = app;
    this.input = input;
    this.listFind = listFind;
    this.listUsers = listUsers;
    this.searchInput = searchInput;
  }

  clickInput(input) {
    input.addEventListener(
      "keyup",
      this.debounce(this.searchUsers.bind(this), 500),
    );
  }

  async searchUsers() {
    this.clearElement(this.listFind);
    if (this.searchInput.value) {
      return await fetch(
        `https://api.github.com/search/repositories?q=${this.searchInput.value}&per_page=${USERS_PER_PAGE}`,
      ).then(res => {
        if (res.ok) {
          res.json().then(res => {
            res.items.forEach(user => {
              this.createUser(user);
            });
          });
        } else {
        }
      });
    } else {
      this.clearElement(this.listFind) = "";
    }
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
    userElement.addEventListener("click", () => this.clickUser(userData));
    userElement.innerHTML = `<span class="b-list__name">${userData.name} </span>`;
    this.listFind.append(userElement);
  }

  clickUser(userData) {
    this.searchInput.value = "";
    this.clearElement(this.listFind);
    const card = this.createCard(userData);
    const buttonClouse = card.querySelector(".b-list__button");
    buttonClouse.addEventListener("click", () => card.remove());
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

  clearElement(element) {
    element.innerHTML = "";
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

const Main = new View(app, input, listFind, listUsers, searchInput);
Main.clickInput(Main.searchInput);
