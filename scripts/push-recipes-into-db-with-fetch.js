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

for (let index = 1; index < 10; index++) {
  const recipes = require(`./recipes-${index}`);
  recipes.forEach(async (recipe) => {
    const percentCarbs = recipe.nutrition.caloricBreakdown.percentCarbs;
    const percentFat = recipe.nutrition.caloricBreakdown.percentFat;
    const percentProtein = recipe.nutrition.caloricBreakdown.percentProtein;

    // [{name: "milk", amount: 3,...},{},{}]
    const ingredients = recipe.extendedIngredients.map((ingredient) => {
      return {
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      };
    });

    const steps = recipe.analyzedInstructions[0].steps.map((step) => {
      return {
        number: step.number,
        text: step.step,
      };
    });

    // const stepNumber = recipe.extend.map(
    //   (step) => recipe.instructions.steps.number
    // );
    // const stepName = recipe.map((step) => recipe.instructions.steps.step);
    // // [sugar, milk, cereal]
    // const ingredientNames = recipe.extendedIngredients.map(
    //   (ingredient) => ingredient.name
    // );
    // const ingredientAmount = recipe.map(
    //   // [3,4,6,2]
    //   (ingredient) => recipe.extendedIngredients.amount
    // );

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
}
