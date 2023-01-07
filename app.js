async function fetchAndSearch(inputIngredients) {
  const url = `https://api.edamam.com/search?q=${inputIngredients}&app_id=2b53a6a1&app_key=8bd43ae7fb696339c4862e063239f341`;
  const response = await fetch(url);
  const jsonData = await response.json();
  return extractRecipeData(jsonData, inputIngredients);
}

function extractRecipeData(jsonData, inputIngredients) {
  const inputIngredientsArray = inputIngredients.split(' ');
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

    let missingIngredients = outputIngredientList.filter((output) =>
      inputIngredientsArray.find((input) => {
        return !output.includes(input);
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
  const recipesDiv = document.getElementById('recipesDiv');
  //IMAGE OF RECIPE
  const displayImage = document.createElement('img');
  displayImage.src = image;
  recipesDiv.appendChild(displayImage);
  //TITLE OF RECIPE
  const displayTitle = document.createElement('p');
  displayTitle.textContent = `Recipe ${index + 1}: ${title}`;
  recipesDiv.appendChild(displayTitle);
  //INGREDIENT LIST
  const displayDetailedIngredientList = document.createElement('p');
  displayDetailedIngredientList.textContent = `Ingredients: ${detailedIngredientList}`;
  recipesDiv.appendChild(displayDetailedIngredientList);
  //MY INGREDIENT LIST
  const displayMyIngredients = document.createElement('p');
  displayMyIngredients.textContent = `My ingredients: ${myIngredients}`;
  recipesDiv.appendChild(displayMyIngredients);
  //MISSING INGREDIENT LIST
  const displayMissingIngredients = document.createElement('p');
  displayMissingIngredients.textContent = `${missingIngredients.length} missing ingredients: ${missingIngredients}`;
  recipesDiv.appendChild(displayMissingIngredients);
  //Cuisine
  const displayCuisine = document.createElement('p');
  displayCuisine.textContent = `Cuisine: ${cuisine}`;
  recipesDiv.appendChild(displayCuisine);
  //Recipe Url
  const displayRecipeUrl = document.createElement('p');
  displayRecipeUrl.textContent = `Find the Full recipe on: ${recipeUrl}`;
  recipesDiv.appendChild(displayRecipeUrl);
}

window.onload = () => {
  const searchField = document.getElementById('searchField');
  const searchButton = document.getElementById('searchButton');

  searchButton.addEventListener('click', searchRecipe);

  function searchRecipe() {
    fetchAndSearch(searchField.value).catch(
      (error) => (document.getElementById('errorMessage').textContent = error),
    );
  }
};
