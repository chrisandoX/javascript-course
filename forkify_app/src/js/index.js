import Search from "./models/Search";
import { elements, renderLoader, clearLoader } from "./views/base";
import * as searchView from "./views/SearchView";

const state = {
};

const controlSearch = async  (e) => {

    const query = searchView.getInput();
    if(query){
        state.search = new Search(query);
    }

    // Prepare UI for results
    searchView.clearResults();
    renderLoader(elements.searchRes);

    // Search for recepies
    await state.search.getResults();
    clearLoader();

    searchView.renderResults(state.search.result);
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch(e);
})

elements.searchResultsPages.addEventListener('click', e => {
     const btn = e.target.closest(".btn-inline");
     if(btn){
         const goToPage = parseInt(btn.dataset.goto);
         searchView.clearResults();
         searchView.renderResults(state.search.result, goToPage);
     }
})