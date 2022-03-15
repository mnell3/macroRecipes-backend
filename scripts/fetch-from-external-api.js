var axios = require("axios").default;
const fs = require("fs");

// https://rapidapi.com/spoonacular/api/recipe-food-nutrition/
// Request #1: 100 random recipes at a time
var options = {
  method: "GET",
  url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random",
  params: { number: "100", limitLicense: "true" },
  headers: {
    "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
    "x-rapidapi-key": "96ae2f4ad8mshd5578d05a86a6a2p163cd4jsn55d55b0c1348",
  },
};

axios
  .request(options)
  .then(function (response) {
    const recipes = response.data.recipes;
    const recipeIDs = recipes.map((recipe) => recipe.id);

    // https://rapidapi.com/spoonacular/api/recipe-food-nutrition/
    // Request #2: Recipe information with nutritional data
    var getInformationBulkRequestOptions = {
      method: "GET",
      url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/informationBulk",
      params: { ids: recipeIDs.join(), includeNutrition: "true" },
      headers: {
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        "x-rapidapi-key": "96ae2f4ad8mshd5578d05a86a6a2p163cd4jsn55d55b0c1348",
      },
    };

    axios
      .request(getInformationBulkRequestOptions)
      .then(function (response) {
        const recipes = response.data;

        // Delete unecessary nutrition for each ingredient (still keeps overall nutrition and ingredients)
        recipes.forEach((recipe) => delete recipe.nutrition.ingredients);

        // Write recipes to a file
        fs.writeFile(
          "recipes-9.json",
          JSON.stringify(recipes, null, 4),
          (err) => {
            // Check for errors
            if (err) throw err;

            console.log("Done writing"); // Success
          }
        );
      })
      .catch(function (error) {
        console.error(error);
      });
  })
  .catch(function (error) {
    console.error(error);
  });

