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

export const renderResults = recipes =>{
    recipes.forEach(renderRecipe);
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
}

const limitRecipeTitle = (title, limit=5) => {
    if(title.length > limit){
        let title_trimmed = title.slice(0, limit+1);
        return title_trimmed.slice(0, title_trimmed.lastIndexOf(" ") != -1 ? title_trimmed.lastIndexOf(" ") : limit);
    }
    return title
}