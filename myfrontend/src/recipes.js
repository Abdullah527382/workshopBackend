import React, { Component } from "react";
import app from "./index";
export default class Recipes extends Component {
  constructor() {
    super();
    this.state = {
      recipes: "Not yet gotten",
    };
  }

  componentDidMount = () => {
    app.get("/getRecipes").then((response) => {
      console.log(response);
    });
  };

  render() {
    return (
      <div>
        <button> Get the recipes </button>
        <h1> The recipes are given below: {this.state.recipes} </h1>
      </div>
    );
  }
}
