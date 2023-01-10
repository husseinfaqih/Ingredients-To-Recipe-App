async function fetchAndSearch(inputIngredients) {
  const url = `https://api.edamam.com/search?q=${inputIngredients}&app_id=2b53a6a1&app_key=8bd43ae7fb696339c4862e063239f341`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return extractRecipeData(jsonData, inputIngredients);
}

function extractRecipeData(jsonData, inputIngredients) {
  const inputIngredientsArray = inputIngredients.split(' ');
  const countRecipes = jsonData.count;
  displayCountingRecipes(countRecipes);
  jsonData.hits.map((result, index) => {
    const outputIngredientList = result.recipe.ingredients.map((ingredient) => {
      return ingredient.food;
    });

    let keyIngredients = outputIngredientList.filter((output) =>
      inputIngredientsArray.find((input) => {
        return output.includes(input);
      }),
    );

    let missingIngredients = outputIngredientList.filter(
      (output) =>
        !inputIngredientsArray.find((input) => {
          return output.includes(input);
        }),
    );

    const image = result.recipe.image;
    const title = result.recipe.label;
    const cuisine = result.recipe.cuisineType;
    const recipeUrl = result.recipe.url;

    displayRecipe(
      image,
      title,
      keyIngredients,
      missingIngredients,
      cuisine,
      recipeUrl,
    );
  });
}

function displayCountingRecipes(countRecipes) {
  const mainDiv = document.getElementById('mainDiv');
  mainDiv.innerHTML = '';
  const countingDiv = document.getElementById('countingDiv');

  countingDiv.innerHTML = '';

  if (countRecipes >= 10) {
    const displayCountRecipes = document.createElement('p');
    displayCountRecipes.textContent = `10+`;
    displayCountRecipes.id = 'displayCountRecipes';
    countingDiv.appendChild(displayCountRecipes);
  } else {
    const displayCountRecipes = document.createElement('p');
    displayCountRecipes.textContent = `0${countRecipes}`;
    displayCountRecipes.id = 'displayCountRecipes';
    displayCountRecipes.className = 'align-self-center';
    countingDiv.appendChild(displayCountRecipes);
  }

  const displayCountText = document.createElement('p');
  const string = 'recipes\nbased\non your\ningredients';
  displayCountText.textContent = string;
  displayCountText.id = 'displayCountText';
  displayCountText.className = 'text-break  align-self-center ';
  countingDiv.appendChild(displayCountText);
}

function displayRecipe(
  image,
  title,
  myIngredients,
  missingIngredients,
  cuisine,
  recipeUrl,
) {
  const mainDiv = document.getElementById('mainDiv');

  const newDiv = document.createElement('div');
  newDiv.id = 'newDiv';
  newDiv.className = 'col-lg-4';

  const imgDiv = document.createElement('div');
  imgDiv.id = 'imgDiv';

  const infoDiv = document.createElement('div');
  infoDiv.id = 'infoDiv';
  infoDiv.className = ' mb-3 card-body text-center bg-white';

  mainDiv.appendChild(newDiv);
  newDiv.appendChild(imgDiv);
  newDiv.appendChild(infoDiv);

  const displayImage = document.createElement('img');
  displayImage.src = image;
  displayImage.className = 'card-img-top';

  imgDiv.appendChild(displayImage);

  const displayTitle = document.createElement('h5');
  displayTitle.textContent = title;
  displayTitle.id = 'displayTitle';
  displayTitle.className = 'card-title';
  infoDiv.appendChild(displayTitle);

  const displayCuisine = document.createElement('h6');
  displayCuisine.textContent = ` - ${cuisine} - `;
  displayCuisine.id = 'displayCuisine';
  displayCuisine.className = 'card-title ';
  infoDiv.appendChild(displayCuisine);

  const displayCountMissingIngredients = document.createElement('p');
  displayCountMissingIngredients.textContent = missingIngredients.length;
  displayCountMissingIngredients.id = 'displayCountMissingIngredients';
  infoDiv.appendChild(displayCountMissingIngredients);

  const displayTitleMissingIngredients = document.createElement('p');
  displayTitleMissingIngredients.textContent = `Missing ingredients:`;
  displayTitleMissingIngredients.id = 'displayTitleMissingIngredients';
  infoDiv.appendChild(displayTitleMissingIngredients);

  const displayMissingIngredients = document.createElement('p');
  const missingIngredientsString = missingIngredients.join(', ');
  displayMissingIngredients.textContent = missingIngredientsString;
  displayMissingIngredients.id = 'displayMissingIngredients';
  displayMissingIngredients.className = 'card-text';
  infoDiv.appendChild(displayMissingIngredients);

  const displayTitleMyIngredients = document.createElement('p');
  displayTitleMyIngredients.textContent = `My ingredients:`;
  displayTitleMyIngredients.id = 'displayTitleMyIngredients';
  infoDiv.appendChild(displayTitleMyIngredients);

  const displayMyIngredients = document.createElement('p');
  const myIngredientsString = myIngredients.join(', ');
  displayMyIngredients.textContent = myIngredientsString;
  displayMyIngredients.id = 'displayMyIngredients';
  infoDiv.appendChild(displayMyIngredients);

  const displayRecipeUrl = document.createElement('a');
  var link = document.createTextNode('Check the full Recipe here!');
  displayRecipeUrl.appendChild(link);
  displayRecipeUrl.href = recipeUrl;
  displayRecipeUrl.target = '_blank';
  displayRecipeUrl.id = 'displayRecipeUrl';
  displayRecipeUrl.className = 'btn btn-warning';
  infoDiv.appendChild(displayRecipeUrl);
}

window.onload = () => {
  const searchField = document.getElementById('searchField');
  const searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', searchRecipe);

  function searchRecipe() {
    fetchAndSearch(searchField.value).catch((error) => {
      document.getElementById('errorMessage').textContent = error;
      console.log(error);
    });
  }
};
