async function fetchAndSearch(inputIngredients) {
  const url = `https://api.edamam.com/search?q=${inputIngredients}&app_id=2b53a6a1&app_key=8bd43ae7fb696339c4862e063239f341`;
  const response = await fetch(url);
  const jsonData = await response.json();
  console.log(jsonData);
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
    const detailedIngredientList = result.recipe.ingredientLines.map(
      (ingredient) => {
        return ingredient;
      },
    );
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
      index,
      title,
      detailedIngredientList,
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
  //Create Counting Div box
  const countingDiv = document.getElementById('countingDiv');
  //Count Recipes
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
    countingDiv.appendChild(displayCountRecipes);
  }

  // text
  const displayCountText = document.createElement('p');
  const string = 'recipes\nbased\non your\ningredients';
  console.log(string);
  displayCountText.textContent = string;
  displayCountText.id = 'displayCountText';
  countingDiv.appendChild(displayCountText);
}

function displayRecipe(
  image,
  index,
  title,
  detailedIngredientList,
  myIngredients,
  missingIngredients,
  cuisine,
  recipeUrl,
) {
  //Create main Recipe DIV
  const mainDiv = document.getElementById('mainDiv');

  //Create new Div box
  const newDiv = document.createElement('div');
  newDiv.id = 'newDiv';

  //Create image Div
  const imgDiv = document.createElement('div');
  imgDiv.id = 'imgDiv';
  // create text Div
  const infoDiv = document.createElement('div');
  infoDiv.id = 'infoDiv';
  //>>
  mainDiv.appendChild(newDiv);
  newDiv.appendChild(imgDiv);
  newDiv.appendChild(infoDiv);
  //>>>

  //IMAGE OF RECIPE
  const displayImage = document.createElement('img');
  displayImage.src = image;
  imgDiv.appendChild(displayImage);

  //TITLE OF RECIPE
  const displayTitle = document.createElement('p');
  displayTitle.textContent = title;
  displayTitle.id = 'displayTitle';
  infoDiv.appendChild(displayTitle);
  //Cuisine
  const displayCuisine = document.createElement('p');
  displayCuisine.textContent = ` - ${cuisine} - `;
  displayCuisine.id = 'displayCuisine';
  infoDiv.appendChild(displayCuisine);
  //MISSING INGREDIENT LIST
  // >>Count Missing INGREDIENTS
  const displayCountMissingIngredients = document.createElement('p');
  displayCountMissingIngredients.textContent = missingIngredients.length;
  displayCountMissingIngredients.id = 'displayCountMissingIngredients';
  infoDiv.appendChild(displayCountMissingIngredients);
  //>>
  // >>Count Missing INGREDIENTS
  const displayTitleMissingIngredients = document.createElement('p');
  displayTitleMissingIngredients.textContent = `Missing ingredients:`;
  displayTitleMissingIngredients.id = 'displayTitleMissingIngredients';
  infoDiv.appendChild(displayTitleMissingIngredients);
  //>>
  const displayMissingIngredients = document.createElement('p');
  const missingIngredientsString = missingIngredients.join(', ');
  displayMissingIngredients.textContent = missingIngredientsString;
  displayMissingIngredients.id = 'displayMissingIngredients';
  infoDiv.appendChild(displayMissingIngredients);

  //>>
  //>>
  //MY INGREDIENT LIST
  const displayTitleMyIngredients = document.createElement('p');
  displayTitleMyIngredients.textContent = `My ingredients:`;
  displayTitleMyIngredients.id = 'displayTitleMyIngredients';
  infoDiv.appendChild(displayTitleMyIngredients);
  //
  const displayMyIngredients = document.createElement('p');
  const myIngredientsString = myIngredients.join(', ');
  displayMyIngredients.textContent = myIngredientsString;
  displayMyIngredients.id = 'displayMyIngredients';
  infoDiv.appendChild(displayMyIngredients);

  //Recipe Url
  const displayRecipeUrl = document.createElement('a');
  var link = document.createTextNode('Check the full Recipe here!');
  displayRecipeUrl.appendChild(link);
  displayRecipeUrl.href = recipeUrl;
  displayRecipeUrl.target = '_blank';
  displayRecipeUrl.id = 'displayRecipeUrl';
  infoDiv.appendChild(displayRecipeUrl);
  //Recipe Url

  //INGREDIENT LIST
  // const displayDetailedIngredientList = document.createElement('p');
  // displayDetailedIngredientList.textContent = `Ingredients: ${detailedIngredientList}`;
  // infoDiv.appendChild(displayDetailedIngredientList);
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
