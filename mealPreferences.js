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
Functions required for mealPreferences table:
 - POST a new mealPreferences profile
 - GET a mealPreferences profile
 - PUT (update) a mealPreferences profile

 For purposes of MVP, I'm not going to worry about deleting mealPreferences.
*/

app.post("/mealPreferences", function(req, res) {
  const query = "INSERT INTO `mealPreferences` VALUES ('', ?, ?, ?, ?, ?);";
  connection.query(query, [req.body.user_dbid, req.body.diet, req.body.exclusions, req.body.calories_min, req.body.calories_max], function(error,data) {
    if (error){
        console.log("Could not save your meal preferences", error);
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

app.get("/mealPreferences/:user", function(req, res) {
  const query = "SELECT * FROM mealPreferences WHERE (mealPreferences.user_dbid = ?)";
    connection.query(query, req.params.user, function(error, data) {
    if(error) {
      console.log("Could not retrieve meal preferences", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        mealPreferences: data
      });
    }
  });
});

app.put("/mealPreferences/:user_dbid", function(req, res) {
  const query = "UPDATE `mealPreferences` SET `mealPreferences`.`diet` = ?, `mealPreferences`.`exclusions` = ?, `mealPreferences`.`calories_min` = ?, `mealPreferences`.`calories_max` = ? WHERE (`mealPreferences`.`user_dbid` = ?)";
  connection.query(query,[req.body.diet, req.body.exclusions, req.body.calories_min, req.body.calories_max, req.params.user_dbid], function (error){
    if (error){
      console.log("Error updating your meal preferences", error);
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