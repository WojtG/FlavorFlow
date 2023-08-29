import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import { async } from 'regenerator-runtime';

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //0 ) Update results view to mark selected search result

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    recipeView.renderSpinner();

    //1) loading recipe

    await model.loadRecipe(id);

    //2) rendering the recipe

    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // 1) Get search query

    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner();

    // 2) Load search query

    await model.loadSearchResults(query);

    // 3) Render results

    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination btns

    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Render new results

  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination btns

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // 1) update recipe ingredients and servings

  model.updateServings(newServings);

  // 2) Redner the recipe view

  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // 1) Add/remove bookmarks

  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view

  recipeView.update(model.state.recipe);

  // 3) Update bookmarks view

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    //render recipe

    recipeView.render(model.state.recipe);

    //success message

    addRecipeView.renderMessage();

    //Render bookmark view again

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form widnow

    setTimeout(function () {
      addRecipeView.closeWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
