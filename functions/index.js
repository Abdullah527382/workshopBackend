const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
// Call the express function to
var bodyParser = require('body-parser')
const app = express(); 
app.use(bodyParser.json());

// Initialize our app:
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
/* exports.helloWorld = functions.https.onRequest((request, response) => {
   functions.logger.info("Hello logs!", {structuredData: true});
   response.send("Hello from Firebase!");
}); */

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
         console.log("RECIPES: "+ JSON.stringify(recipes));
         // By this time the recipes array should be populated by the data
         return response.json({ recipes });
   // Make sure to catch any errors 
   })
   .catch((err) => response.status(500).json({ error: err.code }));
}); 

// POST request 

app.post("/createNewRecipe", (req, res) => {
   // We want to seperate our ingredients array by comma
   // ERRORS: request.body is undefined, request doesn't work --> express?
   console.log("INGREDIENTS: ", req.body);
   const ingredients = req.body.ingredients.split(",");
   const newRecipe = {
      title: req.body.title,
      // Convert string to an integer
      rating: parseInt(String(req.body.rating)),
      imageURL: req.body.imageURL,
      method: req.body.method,
      ingredients: ingredients, 
      type: req.body.type, 
   };
   admin.firestore().collection("recipes").add(newRecipe).then(data => {
      return reponse.json({
         status: "Success", 
         details: `recipe with ID ${data.id} added`,
      });
   }).catch((err) => response.status(500).json({error: err.code}));
})

// We can also specify region
exports.api = functions.region("asia-east2").https.onRequest(app);
