// All Constants
const submit = document.querySelector("#submit");
const searchItem = document.querySelector('.search__field');
const meals = document.querySelector('.results__list');
const singleMeal = document.querySelector('.recipe');
const result = document.querySelector('.results');
let page = 1;
// It depends on us how many recipes we want to show
let perPage = 5;
// It depends on API mean how many items it is returning
let totalResults = 20;
let start = (page - 1) * perPage;
let end = page * perPage;
let length;
const resultPages = document.querySelector('.results__pages');
const loaderSvg = {
    loader:'loader'
}
let lists = null;
const shopingList = document.querySelector(".shopping__list");
const btn = document.querySelector(".recipe__btn");



// All Functions

// ---- Search Meal
function searchMeal(e)
{
    if (e)
    {
         e.preventDefault();
    }
   
    singleMeal.innerHTML = '';
    const term = searchItem.value;

    // When Data is loading
    loader(result);
  
    if (term.trim())
    {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {

                // After data load
                // If there arre no results
                if (data.meals == undefined)
                {
                    console.log('un');
                    clearLoader();
                    return;
                }
                else
                {

                    clearLoader();
                    // If result are less don't show pagination
                if (data.meals.length <= 5)
                {
                    meals.innerHTML = data.meals.map(meal => `
                <li>
                    <a class="results__link" data-mealID = "${meal.idMeal}">
                        <figure class="results__fig">
                            <img src="${meal.strMealThumb}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitTitile(meal.strMeal,15)}</h4>
                            <p class="results__author">The Pioneer Woman</p>
                        </div>
                    </a>
                </li>
                `).join('')
                    
                }
                    // If result are enough show pagination
                else {
                    meals.innerHTML = data.meals.slice(start, end).map(meal => `
                <li>
                    <a class="results__link" data-mealID = "${meal.idMeal}">
                        <figure class="results__fig">
                            <img src="${meal.strMealThumb}" alt="Test">
                        </figure>
                        <div class="results__data">
                            <h4 class="results__name">${limitTitile(meal.strMeal, 15)}</h4>
                            <p class="results__author">The Pioneer Woman</p>
                        </div>
                    </a>
                </li>
                `).join('');
                    length = data.meals.length;
                       pagination(page, length, perPage);
                }  
                }
                console.log(data.meals);
            
            })
        //   searchItem.value = ''
    }
    else
    {
        console.log("Danger");
    }
}

// Get Single Meal
function getSingleMeal(mealID)
{
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res =>  res.json())
        .then(data => {
            // console.log(data);

            const meal = data.meals[0];
            addToDom(meal);
        })
}


// Add to DOM
function addToDom(meal)
{
    const ingredients = [];
    for (let i = 1; i <= 10; i++)
    {
        if (meal[`strIngredient${i}`])
        {
            ingredients.push(`${meal[`strMeasure${i}`]} - ${meal[`strIngredient${i}`]}`)
        }
        else {
            break;
        }
    }
    // console.log(ingredients);
    clearLoader();
    singleMeal.innerHTML = `
     <figure class="recipe__fig">
                <img src="${meal.strMealThumb}" alt="Tomato" class="recipe__img">
                <h1 class="recipe__title">
                    <span>${meal.strMeal}</span>
                </h1>
            </figure>
            <div class="recipe__details">
                <div class="recipe__info">
                   
                    <span class="recipe__info-data recipe__info-data--minutes"> Area : </span>
                    <span class="recipe__info-text"> ${meal.strArea}</span>
                </div>
                <div class="recipe__info">
                  
                    <span class="recipe__info-data recipe__info-data--people">Category : </span>
                    <span class="recipe__info-text"> ${meal.strCategory} </span>
                </div>
                <button class="recipe__love">
                    <svg class="header__likes">
                        <use href="img/icons.svg#icon-heart-outlined"></use>
                    </svg>
                </button>
            </div>



            <div class="recipe__ingredients">
                <ul class="recipe__ingredient-list">
                   ${ingredients.map(ing => `
                    <li class="recipe__item">
                        <svg class="recipe__icon">
                            <use href="img/icons.svg#icon-check"></use>
                        </svg>
                        <div class="recipe__count"></div>
                        <div class="recipe__ingredient">
                            <span class="recipe__unit"></span>
                            ${ing}
                        </div>
                    </li>
                   `).join('')}
                   
                </ul>

                <button class="btn-small recipe__btn recipe__btn--add">
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-shopping-cart"></use>
                    </svg>
                    <span>Add to shopping list</span>
                </button>
            </div>

            <div class="recipe__directions">
                <h2 class="heading-2">How to cook it</h2>
                <p class="recipe__directions-text">
                    This recipe was carefully designed and tested by
                    <span class="recipe__by">The Pioneer Woman</span>. Please check out directions at their website.
                </p>
                <a class="btn-small recipe__btn" href="${meal.strSource || meal.strYoutube}" target="_blank">
                    <span>Directions</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-right"></use>
                    </svg>

                </a>
            </div>`
    
    lists = ingredients;
    console.log(lists);
}
// Event Listeners
submit.addEventListener("submit", searchMeal);
meals.addEventListener('click',e => {
    const mealInfo = e.path.find(
        item => {
            if (item.classList)
            {
                
                return item.classList.contains('results__link');
            }
            else {
                
            }
        }
    )
    // console.log(mealInfo);

    if (mealInfo)
    {
        const mealID = mealInfo.getAttribute('data-mealid');
        console.log(mealID);
         loader(singleMeal);
        getSingleMeal(mealID);
    }
});

// Pagination Buttons
resultPages.addEventListener('click', e => {
    // console.log(e.target);

    const btn = e.target.closest('.btn-inline');
    if (btn)
    {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        page = gotoPage;
        start = (page - 1) * perPage;
        end = page * perPage;
        searchMeal();
        resultPages.innerHTML = '';
        meals.innerHTML = ''
        
        console.log(page,start,end);
    }
})


function createBtn(page, type)
{
    return  `<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                </button>`
}
function loader(parent)
{
    const loader = `<div class="${loaderSvg.loader}">
    <svg>
    <use href="img/icons.svg#icon-cw"></use>
    </svg>
    </div>`;
    parent.insertAdjacentHTML('afterbegin', loader);
}
function clearLoader() {
    const loader = document.querySelector(`.${loaderSvg.loader}`);
    if (loader)
    {
        loader.parentElement.removeChild(loader);
    }
    
}
// Limit Title
function limitTitile(title, limit)
{
    const newTitle = [];
    if (title.length > limit)
    {
        title.split(' ').reduce((acc, cur) => {
          
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
            
        }, 0);

        return `${newTitle.join(' ')}...`;
    }
    return title;
}

function pagination(page, numResults, perPage)
{
    const pages = Math.ceil(numResults / perPage);
    let button;
    if (page === 1 && pages > 1)
    {
        // Only next page
       button =  createBtn(page, 'next');
    } else if (page < pages) {
        button = `
         ${createBtn(page, 'prev')}
         ${createBtn(page, 'next')}
        `
    }
    else if (page === pages && pages > 1) {
       // Only prev page  
         button =  createBtn(page, 'prev');
    }
    resultPages.insertAdjacentHTML('afterbegin', button);
}

singleMeal.addEventListener("click", e => {
    
    if (e.target.matches('.recipe__btn--add,.recipe__btn--add *'))
    
    {
        
        }
})
// [1,2,3] splice(1,1) return 2, and original array -> [1,3];
// [1,2,3] slice(1,1) return 2, and original array -> [1,2,3];












