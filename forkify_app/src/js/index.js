import Search from "./models/Search";


const state = {
};

const controlSearch = async  (e) => {

    const query = "pizza" //TODO take it from view
    if(query){
        state.search = new Search(query);
    }

    // Prepare UI for results

    // Search for recepies
    await state.search.getResults();

    console.log(state.search.result);
}


document.querySelector(".search").addEventListener('submit', e => {
    e.preventDefault();
    controlSearch(e);
})
