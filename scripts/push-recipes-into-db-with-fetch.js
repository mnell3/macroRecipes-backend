const recipes = require("./recipes-4.json");
var axios = require("axios").default;
const fs = require("fs");
const res = require("express/lib/response");

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

recipes.forEach(async (recipe) => {
  const percentCarbs = recipe.nutrition.caloricBreakdown.percentCarbs;
  const percentFat = recipe.nutrition.caloricBreakdown.percentFat;
  const percentProtein = recipe.nutrition.caloricBreakdown.percentProtein;

  // create simplified recipe object
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

  // make sure server is running...
  // Add recipe to db.json

  try {
    await axios.post("http://localhost:3000/recipes", simpleRecipe);

    console.log(simpleRecipe.id, "Success");
  } catch (error) {
    console.log(simpleRecipe.id, error.response?.status);
  }

  // });

  // try{

  // var options = {
  //   method: "GET",
  //   url: "http://localhost:3000/recipes",
  //  };

  // axios.request(options).then(function (response) {
  //   const recipes = response;
  //   // [ {id: 1}, {id: 48324}, {id: 94757}, ...]
  //   console.log(recipes);

  //   console.error(error);

  //   recipes.forEach((recipe) =>
  // axios
  //   .delete("http://localhost:3000/recipes/)
  //   .then((res) => console.log("DELETED"))
  //   .catch((err) => console.log(err));
  //   );
  // }
  //   .catch(function (error) {
  //       console.error(error);
});
