import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
    const markup = `           
        <li>
            <a class="results__link href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${limitRecipeTitle(recipe.title)}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`;
    elements.searchResultList.insertAdjacentHTML("beforeend", markup);
}

const renderButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto='${type === 'prev' ? page - 1:page + 1}'>
     <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numOfResults, resPerPage) => {
    const pages = Math.ceil(numOfResults / resPerPage);

    let button;
    if (page === 1 && pages > 1){
        button = renderButton(page, "next");
    } else if (page < pages){
        button = `
            ${renderButton(page, "next")}
            ${renderButton(page, "prev")}
        `;
    }
    else if (page === pages && pages > 1) {
        button = renderButton(page, "prev");
    }
    elements.searchResultsPages.insertAdjacentHTML("afterbegin", button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = [page - 1]*resPerPage;
    const end = page*resPerPage;
    renderButtons(page, recipes.length, resPerPage);
    recipes.slice(start, end).forEach(renderRecipe);
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultsPages.innerHTML = '';
}

const limitRecipeTitle = (title, limit=5) => {
    if(title.length > limit){
        let title_trimmed = title.slice(0, limit+1);
        return title_trimmed.slice(0, title_trimmed.lastIndexOf(" ") != -1 ? title_trimmed.lastIndexOf(" ") : limit);
    }
    return title
}