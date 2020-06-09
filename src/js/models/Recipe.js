import axios from "axios";
import { proxy, url } from "../config";

class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    const res = await axios(`${proxy}${url}/get?rId=${this.id}`)
      .then((data) => {
        this.title = data.data.recipe.title;
        this.author = data.data.recipe.publisher;
        this.img = data.data.recipe.image_url;
        this.url = data.data.recipe.source_url;
        this.ingredients = data.data.recipe.ingredients;
      })
      .catch((err) => console.log(err));
  }

  calcTime() {
    //   Assuming that we need 15mins for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServing() {
    this.serving = 4;
  }

  parseIngredients() {
    const unitLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];

    const units = [...unitShort, "kg", "g"];
    const newIngredients = this.ingredients.map((el) => {
      //   1. Uniform units
      let ingredient = el.toLowerCase();
      unitLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, unitShort[index]);
      });
      //   2. Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // 3. Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      /**
       * Cool trick to find the index of an item we don't know
       */
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        //   There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2]
        //  Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = arrIng[0];
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };
      } else if (parseInt(arrIng[0], 10)) {
        //   There is no unit, but the first element is a number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        //   There is No unit and No number in the first position NaN
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // servings
    const newServings = type === "dec" ? this.serving - 1 : this.serving + 1;

    // ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.serving;
    });

    this.serving = newServings;
  }
}

export default Recipe;
