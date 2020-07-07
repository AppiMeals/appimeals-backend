const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

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
Functions required for mealSelections table:
 - POST a new mealSelections profile
 - GET a mealSelections profile
 - PUT (update) a mealSelections profile

 For purposes of MVP, I'm not going to worry about deleting 
 mealSelections since the PUT function more or less duplicates that.
*/

app.post("/mealSelections", function(req, res) {
  const query = "INSERT INTO `mealSelections` VALUES ('', ?, ?)";
  connection.query(query, [req.body.user_dbid, req.body.meals], function(error,data) {
    if (error){
        console.log("Could not save your meal selections", error);
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

app.get("/mealSelections", function(req, res) {
  const query = "SELECT * FROM mealSelections WHERE (mealSelections.user_dbid = ?)";
    connection.query(query, req.query.user_dbid, function(error, data) {
    if(error) {
      console.log("Could not retrieve meal selections", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        mealSelections: data
      });
    }
  });
});

app.put("/mealSelections/:user_dbid", function(req, res) {
  const query = "UPDATE `mealSelections` SET `mealSelections`.`mealsString` = ? WHERE (`mealSelections`.`user_dbid` = ?)";
  
  connection.query(query,[req.body.diet, req.body.exclusions, req.body.calories_min, req.body.calories_max, req.params.user_dbid], function (error){
    if (error){
      console.log("Error updating your meal selections", error);
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