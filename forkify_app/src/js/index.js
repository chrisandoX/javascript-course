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
    console.log(state.search.result);
    searchView.renderResults(state.search.result);
}


elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch(e);
})
