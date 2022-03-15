// replace line 2 with the recipe json file that needs to be pushed
const recipes = require("./recipes-2.json");
var axios = require("axios").default;
const fs = require("fs");

const getMacro = (percentCarbs, percentFat, percentProtein) => {
  if (
    percentCarbs <= 60 &&
    percentCarbs >= 40 &&
    percentFat >= 15 &&
    percentFat <= 25
  ) {
    return "bodybuilding";
  } else if (
    percentCarbs <= 50 &&
    percentCarbs >= 30 &&
    percentFat >= 25 &&
    percentFat <= 35
  ) {
    return "maintenance";
  } else if (
    percentCarbs <= 30 &&
    percentCarbs >= 10 &&
    percentFat >= 30 &&
    percentFat <= 40
  ) {
    return "fat-loss";
  } else {
    return "custom";
  }
};

// Get the percent carbs, fat, and protein
for (let index = 1; index < 10; index++) {
  const recipes = require(`./recipes-${index}`);
  recipes.forEach(async (recipe) => {
    const percentCarbs = recipe.nutrition.caloricBreakdown.percentCarbs;
    const percentFat = recipe.nutrition.caloricBreakdown.percentFat;
    const percentProtein = recipe.nutrition.caloricBreakdown.percentProtein;

    // Get ingredient name, amount, and unit for each ingredient
    const ingredients = recipe.extendedIngredients.map((ingredient) => {
      return {
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      };
    });

    // Get each step in the recipe
    const steps = recipe.analyzedInstructions[0].steps.map((step) => {
      return {
        number: step.number,
        text: step.step,
      };
    });

    // create simplified recipe object
    let simpleRecipe = {
      id: recipe.id,
      title: recipe.title,
      url: recipe.sourceUrl,
      image: recipe.image,
      summary: recipe.summary,
      minutes: recipe.readyInMinutes,
      servings: recipe.servings,
      steps: steps,
      ingredients: ingredients,
      nutrition: {
        calories: recipe.nutrition.nutrients[0].amount,
        percentFat: percentFat,
        percentCarbs: percentCarbs,
        percentProtein: percentProtein,
      },
      // Sets macro to the correct macro based off the carb, fat, and protein percentages
      macro: getMacro(percentCarbs, percentFat, percentProtein),
    };

    // make sure server is running...
    // Add recipe to db.json

    try {
      await axios.post("http://localhost:3000/recipes", simpleRecipe);

      console.log(simpleRecipe.id, "Success");
    } catch (error) {
      console.log(
        simpleRecipe.id,
        error.response?.status,
        error.response.data.split("\n")[0]
      );
    }
  });
}
