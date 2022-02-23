const recipes = require("./recipes.json");
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

const simpleRecipes = [];

recipes.forEach((recipe) => {
  const percentCarbs = recipe.nutrition.caloricBreakdown.percentCarbs;
  const percentFat = recipe.nutrition.caloricBreakdown.percentFat;
  const percentProtein = recipe.nutrition.caloricBreakdown.percentProtein;

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

  simpleRecipes.push(simpleRecipe);
});

// Write recipes to a file
fs.writeFile(
  "../backend/db.json",
  JSON.stringify(simpleRecipes, null, 4),
  (err) => {
    // Checking for errors
    if (err) throw err;

    console.log("Done writing"); // Success
  }
);

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
