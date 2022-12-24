const app = document.getElementById("app");
const input = document.querySelector(".b-input");
const listFind = document.querySelector(".b-input__list");
const listUsers = document.querySelector(".b-list");
const searchInput = document.querySelector(".search-input");
const USERS_PER_PAGE = 5;

const debounce = (fn, debounceTime) => {
  let timeout;
  function wrapper() {
    const func = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(func, debounceTime);
  }
  return wrapper;
};

async function searchUsers() {
  listFind.innerHTML = "";
  if (searchInput.value) {
    return await fetch(
      `https://api.github.com/search/repositories?q=${searchInput.value}&per_page=${USERS_PER_PAGE}`,
    ).then(res => {
      if (res.ok) {
        res.json().then(res => {
          res.items.forEach(user => {
            createUser(user);
          });
        });
      } else {
        return res.json().then(error => {
          const err = new Error("Запрос не получен");
          err.data = error;
          throw err;
        });
      }
    });
  } else {
    listFind.innerHTML = "";
  }
}

function createUser(userData) {
  const userElement = this.createElement("button", "b-input__el");
  userElement.addEventListener("click", () => {
    searchInput.value = "";
    listFind.innerHTML = "";
    const card = this.createCard(userData);
    const buttonClouse = card.querySelector(".b-list__button");
    buttonClouse.addEventListener("click", () => card.remove());
  });
  userElement.innerHTML = `<span class="b-list__name">${userData.name} </span>`;
  listFind.append(userElement);
}

function createElement(elementTag, elementClass) {
  const element = document.createElement(elementTag);
  if (elementClass) {
    element.classList.add(elementClass);
  }
  return element;
}

function createCard(userData) {
  const elementList = createElement("div", "b-list__el");
  elementList.innerHTML = `<ul class="b-list__list"> 
                            <li>Name:${userData.name}</li>
                            <li>Owner:${userData.owner.login}</li>
                            <li>Stars:${userData.stargazers_count}</li>
                          </ul>
                          <button class = "b-list__button">
                            <img src="img/close.svg" alt="Clouse">
                          </button>`;
  listUsers.append(elementList);
  return elementList;
}

searchInput.addEventListener("keyup", debounce(searchUsers, 1500));
