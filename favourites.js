const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "appiMeals"
})

/*
Functions required for favourites table:
 - POST a new Favourite Recipe
 - GET list of favourite recipes
 - DELETE a Favourite Recipe

GET & DELETE ALSO APPEARS TO BE BUGGED ATM.

*/

app.get("/favourites", function(req, res) {
  const query = "SELECT * FROM favourites WHERE (favourites.user_dbid = ?)";
    connection.query(query, req.query.user_dbid, function(error, data) {
    if(error) {
      console.log("Could not retrieve favourite recipes", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        favourites: data
      });
    }
  });
});

app.post("/favourites", function(req, res) {
  const query = "INSERT INTO `favourites` VALUES ('', ?, ?)";
  connection.query(query, [req.body.user_dbid, req.body.recipe_id], function(error,data) {
    if (error){
        console.log("Could not save recipe as a favourite", error);
        res.status(500).json({
          error: error
        });
    }
    else {
        res.status(201).json({
          data: data
        });
    }
  });
});

app.delete("/favourites/:favourite_dbid", function(req, res) {
  const query = "DELETE FROM `favourites` WHERE (`favourites`.`favourite_dbid` = ?)";
  connection.query(query, [req.params.favourite_dbid], function(error){
    if (error){
      console.log("Was unable to remove that recipe from your favourites list", error);
      res.status(500).json({
        error: error
      });
    }
    else {
      res.sendStatus(200);
    }
  });
});

module.exports.handler = serverless(app);