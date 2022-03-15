const recipes = require("./recipes-4.json");
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

// Create a simplified recipe with just the needed information
const simpleRecipes = [];

recipes.forEach((recipe) => {
  const percentCarbs = recipe.nutrition.caloricBreakdown.percentCarbs;
  const percentFat = recipe.nutrition.caloricBreakdown.percentFat;
  const percentProtein = recipe.nutrition.caloricBreakdown.percentProtein;

  let simpleRecipe = {
    id: recipe.id,
    title: recipe.title,
    url: recipe.sourceUrl,
    image: recipe.image,
    summary: recipe.summary,
    minutes: recipe.readyInMinutes,
    servings: recipe.servings,
    steps: recipe.instructions,
    nutrition: {
      calories: recipe.nutrition.nutrients[0].amount,
      percentFat: percentFat,
      percentCarbs: percentCarbs,
      percentProtein: percentProtein,
    },
    macro: getMacro(percentCarbs, percentFat, percentProtein),
  };

  simpleRecipes.push(simpleRecipe);
});

const output = { recipes: simpleRecipes };

// Write recipes to a file
fs.writeFile("../db.json", JSON.stringify(output, null, 4), (err) => {
  // Check for errors
  if (err) throw err;

  console.log("Done writing"); // Success
});

