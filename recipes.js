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



//GET - Fill the page with recipes from Edamam

//Still need to add filters to manipulate the query

app.get("/browse-recipes/", function (req, res) {

  //Taking the react GET request query input parameter and passing it to the back end.  
  let searchQuery = req.query.input;

  axios.get(`https://api.edamam.com/search?q=${searchQuery}&app_id=fce15b25&app_key=8b32dc22c438268e5fc874e29967d9fa&from=0&to=10&calories=591-722`)
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

//POST// ADD TASK TO mealSelections TABLE

app.post("/browse-recipes", function(req, res) {

  const query = "INSERT INTO mealSelections (user_dbid, recipe_id, day, favourite) VALUES (?, ?, ?, ?);";

  const querySelect = "SELECT * FROM mealSelections WHERE user_dbid = ?;";


  connection.query(query, [req.body.user_dbid, req.body.recipe_id, req.body.favourite, req.body.day], function(error, data){
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