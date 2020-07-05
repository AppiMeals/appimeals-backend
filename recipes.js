const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: "recipes"
// });

/*

Jennifer Calland: TBF, I don't think we should be responsible for keeping Spoonacular's recipes in our database

I think we need our 'appiMeals' MySQL database on our AWS, and otherwise let Spoonacular keep 
their own database that we link through via recipe DBIDs.  And feel free to remove this 
comment once its read and acknowledged

Also-- aside--- 'steamed oats'  ... just what have you been eating lately???? ;-P

*/

app.get("/browse-recipes", function(req, res) {
  res.send({ recipe: ["burned chicken", "fish of chips", "steamed oats"] });
});

module.exports.handler = serverless(app);