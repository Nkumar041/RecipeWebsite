import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// NOTE: WHEN WE RUN THE HTML FILE USING NPM, THE HTML AND JS THAT IS USED IS THAT FROM THE DIST FOLDER, SO EVERYTHING IN THERE IS BEING USED. THE STUFF WE DO IN THE SRC FOLDER IS JUST FOR DEVELOPMENT, AND IT IS SHIPPED TO THE DIST WHICH IS THEN USED FOR THE REAL SITE

// console.log(icons);
// we are importing this because we need a way to access images when we use their url in the inserted html.
import 'core-js/stable'; // for polyfilling everything else
import 'regenerator-runtime/runtime'; // for polyfilling async await

// comes from parcel
// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // THIS IS HOW TO GET HASH FROM THE URL
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // 1. Loading Recipe
    await model.loadRecipe(id); // ALL ASYNC FUNCTIONS RETURN A PROMISE, SO IN ORDER FOR THE FUNCTION TO DO ANY WORK, WE HAVE TO AWAIT IT

    // 2. Rendering Recipe
    recipeView.render(model.state.recipe);

    // // TEST
    // controlServings();
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. load search
    await model.loadSearchResults(query);

    // 3. render results
    // console.log(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // 4. render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  // render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // render new buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update recipe servings (in state)
  model.updateServings(newServings);
  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  // console.log(model.state.recipe);

  // update recipe view
  recipeView.update(model.state.recipe);

  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // console.log(newRecipe);
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL (using history API) NEW
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // allows to change URL without re-loading the page. only 3rd argument matters

    // close form window (after some time)
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err + ' bruhh');
    addRecipeView.renderError(err.message);
  }
};

// const newFeature = function () {
//   console.log('welcome');
// };

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  // newFeature();
  // console.log('sup');
};
init();
// Architecture:
// Components Of Any Architecture:
// Business Logic (code that solves business problems), State (stores all data about the application), HTTP Library (responsible for making and receiving AJAX requests), Application Logic (router, code that is only conscerned about the implentation of application itself), Presentation Logic (UI layer, code that is concerned about the visible part of the application)
