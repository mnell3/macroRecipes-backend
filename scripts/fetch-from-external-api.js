var axios = require("axios").default;
const fs = require("fs");

// Request #1: 100 random recipes
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
    const recipes = response.data.recipes; // [ {id: 1}, {id: 48324}, {id: 94757}, ...]
    const recipeIDs = recipes.map((recipe) => recipe.id); // [1,48324, 9434]

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

        // Delete nutrition for each ingredient (still keeps overall nutrition and ingredients)
        recipes.forEach((recipe) => delete recipe.nutrition.ingredients);

        // Write recipes to a file
        fs.writeFile(
          "recipes.json",
          JSON.stringify(recipes, null, 4),
          (err) => {
            // Checking for errors
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

// var options2 = {
//   method: "GET",
//   url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipe_id}/nutritionWidget.json`,
//   headers: {
//     "x-rapidapi-host": "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
//     "x-rapidapi-key": "96ae2f4ad8mshd5578d05a86a6a2p163cd4jsn55d55b0c1348",
//   },
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

// var axios = require("axios").default;

// const queries = [
//   "chicken",
//   "steak",
//   "beans",
//   "lettuce",
//   "rice",
//   "fish",
//   "cheese",
//   "chocolate",
//   "pizza",
//   "milk",
// ];

// var options = {
//   method: "GET",
//   url: "https://edamam-recipe-search.p.rapidapi.com/search",
//   params: { q: "chicken" },
//   headers: {
//     "x-rapidapi-host": "edamam-recipe-search.p.rapidapi.com",
//     "x-rapidapi-key": "96ae2f4ad8mshd5578d05a86a6a2p163cd4jsn55d55b0c1348",
//   },
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//     const hits = response.data.hits;
//     const recipes = hits.map((hit) => hit.recipe);
//     recipes.forEach((recipe) => {
//       console.log(recipe);
//     });
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
