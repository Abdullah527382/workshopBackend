const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
// Call the express function to
// var bodyParser = require('body-parser')
const app = express(); 
// app.use(bodyParser.json());
const firebase = require("firebase");
// Initialize our app:
admin.initializeApp();

// Note: We will be using express to make our code more compact and readable
app.get("/getRecipes", (request, response) => {
   // How to access our database:
   admin.firestore().collection("recipes").get().then((data) => {
      // console.log("DATA: " + JSON.stringify(data));
         let recipes = []; // new array 
         // Use the high order function 'forEach' to iterate through the array
         data.forEach((doc) => {
            // console.log("DOC: "+ JSON.stringify(doc));

            recipes.push(doc.data());
         });
         // console.log("RECIPES: "+ JSON.stringify(recipes));
         // By this time the recipes array should be populated by the data
         return response.json({ recipes });
   // Make sure to catch any errors 
   })
   .catch((err) => response.status(500).json({ error: err.code }));
}); 

// POST request 

app.post("/createNewRecipe", (request, response) => {
   // We want to seperate our ingredients array by comma
   // ERRORS: request.body is undefined, request doesn't work --> express?
   var ingredientStr = request.body.ingredients + "";
   const ingredients = ingredientStr.split(",");
   ingredients.pop();
   const newRecipe = {
      title: request.body.title,
      // Convert string to an integer
      rating: parseInt(String(request.body.rating)),
      imageURL: request.body.imageURL,
      method: request.body.method,
      ingredients: ingredients, 
      type: request.body.type, 
   };

   admin.firestore().collection('recipes').add(newRecipe).then((data) => {
         response.json({ message: `recipe with ID ${data.id} added` });
   })
   .catch((err) => {
      response.status(500).json({ status: "failed", error: err.code });
   })
});

// We can also specify region
exports.api = functions.https.onRequest(app);
