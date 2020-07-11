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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "appiMeals"
})


app.get("/MyMealChoices", function(req, res) {

    const query = "SELECT * FROM recipesData;"
  
    connection.query(query, function(error, data) {
      if(error) {
        console.log("Error fetching tasks", error);
        res.status(500).json({
          error: error
        });
      } else {
        res.status(200).json({
          recipesData: data
        });
      }
    });
});


module.exports.handler = serverless(app);