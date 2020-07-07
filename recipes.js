const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const axios = require('axios');
require('dotenv').config()

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


app.get("/browse-recipes", function (req, res) {

  axios.get(`https://api.edamam.com/search?q=chicken&app_id=fce15b25&app_key=8b32dc22c438268e5fc874e29967d9fa&from=0&to=10&calories=591-722`)
    .then(function (response) {
      //Send the data(JSON) to the front end
      res.json(response.data)
    })
  .catch(function (error) {
    // handle error
    console.error(error);
    res.status(500).json({ error })
  })
});

//POST// ADD TASK TO favourites TABLE

app.post("/browse-recipes", function(req, res) {

  const query = "INSERT INTO favourites (user_dbid, recipe_id) VALUES (?, ?);";

  const querySelect = "SELECT * FROM favourites WHERE user_dbid = ?;";


  connection.query(query, [req.body.user_dbid, req.body.recipe_id], function(error, data){
    if(error) {
      console.log("Error handling tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
     connection.query(querySelect, [req.body.user_dbid], function(error, data){
       if(error) {
        console.log("Error handling tasks", error);
        res.status(500).json({
          error: error
        });
       } else {
         res.status(201).json({
          data
         });
       }
     });
     
    }
  });
});

module.exports.handler = serverless(app);