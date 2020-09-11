const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
const path = require("path");

const firebase = require("firebase");
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../myfrontend/src")));
// Below is used for our sign-in/out route
const firebaseConfig = {
  apiKey: "AIzaSyCRtYaiTnH6GKa97-ygal3u4l-n5WVWHcU",
  authDomain: "recipieces-e3e25.firebaseapp.com",
  databaseURL: "https://recipieces-e3e25.firebaseio.com",
  projectId: "recipieces-e3e25",
  storageBucket: "recipieces-e3e25.appspot.com",
  messagingSenderId: "584348442895",
  appId: "1:584348442895:web:dee8ebd43f832491641e7a",
  measurementId: "G-4M839PNC02",
};
// Initialize our app:
admin.initializeApp();
// db = database
const db = admin.firestore();
firebase.initializeApp(firebaseConfig);
// Note: We will be using express to make our code more compact and readable
app.get("/getRecipes", (request, response) => {
  // How to access our database:
  db.collection("recipes")
    .get()
    .then((data) => {
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

  db.collection("recipes")
    .add(newRecipe)
    .then((data) => {
      response.json({ message: `recipe with ID ${data.id} added` });
    })
    .catch((err) => {
      response.status(500).json({ status: "failed", error: err.code });
    });
});

// Get the recipe via ID
app.get("/recipe/:recipeID", (request, response) => {
  db.collection("recipes")
    .doc(request.params.recipeID)
    .get()
    .then((data) => {
      if (data.exists) {
        return response.json({ status: "Success", movie: data.data() });
      } else
        return response
          .status(404)
          .json({ status: "Failed", error: "Recipe not found" });
    })
    .catch((err) => {
      return response.status(500).json({ error: err.code });
    });
});

app.post("/signup", (request, response) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(request.body.email, request.body.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((err) => response.status(500).json({ error: err.code }));
});

app.post("/login", (request, response) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(request.body.email, request.body.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return response.json({ token });
    })
    .catch((err) => response.status(500).json({ error: err.code }));
});

// We can also specify region
exports.api = functions.https.onRequest(app);
