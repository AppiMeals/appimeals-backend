const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require('axios');
const app = express();


app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: "appimeals-db.capjtotdxdxl.eu-west-2.rds.amazonaws.com",
  user: "root",
  password: "t9&jlnePhi_r",
  database: "recipes"
});

/*

Jennifer Calland: TBF, I don't think we should be responsible for keeping Spoonacular's recipes in our database

I think we need our 'appiMeals' MySQL database on our AWS, and otherwise let Spoonacular keep 
their own database that we link through via recipe DBIDs.  And feel free to remove this 
comment once its read and acknowledged

Also-- aside--- 'steamed oats'  ... just what have you been eating lately???? ;-P

*/

app.get("/browse-recipes", function(req, res) {

  axios.get(`https://api.spoonacular.com/recipes/random?number=2&tags=vegetarian,dessert&apiKey=5059b8d98fa64de5b6da983974896a37`)
    .then(function (response) {
      // handle success
      res.json(response.data)
    })
    .catch(function (error) {
      // handle error
      console.error(error);
      res.status(500).json({error})
    })
})

app.listen(8900, () => {
  console.log("App starting port ", 8900);
});

module.exports.handler = serverless(app);