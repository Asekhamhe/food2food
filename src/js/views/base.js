export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchResultList: document.querySelector(".results__list"),
  searchResult: document.querySelector(".results"),
  searchResultPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
};

const elementStrings = {
  loader: "loader",
};

export const renderLoader = (parent) => {
  const loader = `
  <div class="${elementStrings.loader}">
  <svg>
  <use href="img/icons.svg#icon-cw"></use>
  </svg>
  </div>
  `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  // Remove loader
  if (loader) loader.parentElement.removeChild(loader);
};
