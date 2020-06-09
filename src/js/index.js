import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Likes from "./models/Likes";

/**
 * Global state of the app
 * Search object
 * Current recipe object
 * Shopping list object
 * Liked recipes
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1. Get query from view
  const query = searchView.getInput();

  if (query) {
    // 2. New search object and add to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchResult);

    try {
      // 4. Search for recipes
      await state.search.getResults();

      // 5. Render results on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("oops...");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});

elements.searchResultPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResults();
    searchView.renderResults(state.search.result, gotoPage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // Get ID from url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServing();

      // Render recipe
      clearLoader();

      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert("Error processing recipe...");
    }
  }
};

const events = ["hashchange", "load"];
events.forEach((event) => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const controlList = () => {
  // create a new list if none yet
  if (!state.list) state.list = new List();
  // add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);

    // Handle update count
  } else if (e.target.matches(".shopping__count-value")) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/**
 * LIKE CONTROLLER
 */

const controlLike = () => {
  // create a new like object
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  //  User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {
    // Add like to the state
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likesView.toggleLikeBtn(true);

    // Add like to the UI

    likesView.renderLike(newLike);
  } else {
    // Remove like from the state
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like from UI list
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener("load", () => {
  state.likes = new Likes();
  state.likes.readStorage();
  likesView.toggleLikeMenu(state.likes.getNumLikes());
  // Render the existing likes
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // decrease button
    if (state.recipe.serving > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // increase button
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add to list button
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    // Like controller
    controlLike();
  }
});
