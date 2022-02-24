// make sure to set correct input file
const recipes = require("./recipes-3.json");
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
    percentCarbs <= 30 &&
    percentCarbs >= 50 &&
    percentFat >= 25 &&
    percentFat <= 35
  ) {
    return "maintenance";
  } else if (
    percentCarbs <= 10 &&
    percentCarbs >= 30 &&
    percentFat >= 30 &&
    percentFat <= 40
  ) {
    return "fat-loss";
  } else {
    return "custom";
  }
};

recipes.forEach(async (recipe) => {
  const percentCarbs = recipe.nutrition.caloricBreakdown.percentCarbs;
  const percentFat = recipe.nutrition.caloricBreakdown.percentFat;
  const percentProtein = recipe.nutrition.caloricBreakdown.percentProtein;

  // create simplified recipe object
  let simpleRecipe = {
    id: recipe.id,
    title: recipe.title,
    steps: recipe.instructions,
    url: recipe.sourceUrl,
    servings: recipe.servings,
    minutes: recipe.readyInMinutes,
    summary: recipe.summary,
    nutrition: {
      calories: recipe.nutrition.nutrients.calories,
      percentFat: percentFat,
      percentCarbs: percentCarbs,
      percentProtein: percentProtein,
    },
    macro: getMacro(percentCarbs, percentFat, percentProtein),
  };

  // make sure server is running...
  // Add recipe to db.json
  try {
    await axios.post("http://localhost:3000/recipes", simpleRecipe);
    console.log(simpleRecipe.id, "Success");
  } catch (error) {
    console.log(simpleRecipe.id, error.response.status);
  }
});

/**
 * 
 *  {
      "id": 1,
      "title": "Chicken Soup",
      "author": "Mary",
      "steps": "Step 1: Mix ingredients. Step 2: Cook them. Step 3: Enjoy!",
      "nutrition": {
        "carbs": 50,
        "fat": 10
      },
      "macro": "body-building"
    }
 */
