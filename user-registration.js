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
Functions required for users table:
 - POST a new user account
 - GET a user's details if the username/password matches
 
 I'm not going to worry about Users updating their information
 or deleting their account as its not part of MVP

*/

app.get("/users", function(req, res) {
  // const query = "SELECT * FROM tasks";
  const query = "SELECT * FROM users WHERE ((users.email = ?) AND (users.password = ?)) LIMIT 1;";
  //connection.query(query, function(error, data) {
    connection.query(query, req.query.email, req.query.password, function(error, data) {
    if(error) {
      console.log("Login Error", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        users: data
      });
    }
  });
});

app.post("/users", function(req, res) {

  const query = "INSERT INTO `users` VALUES ('', ?, ?, ?, ?)";

  connection.query(query, [req.body.firstName, req.body.surname, req.body.email, req.body.password], function(error,data) {
    if (error){
        console.log("Registration Error", error);
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


// app.delete("/tasks/:taskId", function(req, res) {
// /*
//   For purposes of this week's homework, delete queries and such are written below.
//   However for purposes of my database, tasks are meant to be 'archived' so the 
//   query would be changed to an update query where complete_status_id is changed to 3.
// */
//   const query = "DELETE FROM `tasks` WHERE (`tasks`.`task_id` = ?)";
//   connection.query(query, [req.params.taskId], function(error){
//     if (error){
//       console.log("Error deleting task", error);
//       res.status(500).json({
//         error: error
//       });
//     }
//     else {
//       res.sendStatus(200);
//     }
//   });
// });

// app.put("/tasks/:taskId", function(req, res) {
//   const query = "UPDATE `tasks` SET `tasks`.complete_status_id = ? WHERE (`tasks`.`task_id` = ?)";
  
//   connection.query(query,[req.body.complete_status_id, req.params.taskId], function (error){
//     if (error){
//       console.log("Error updating task", error);
//       res.status(500).json({
//         error: error
//       });
//     }
//     else {
//       res.sendStatus(200);
//     }
//   });
// });


/*
Functions required for favourites table:
 - POST a new Favourite Recipe
 - GET list of favourite recipes
 - DELETE a Favourite Recipe

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

app.get("/mealPreferences", function(req, res) {
  const query = "SELECT * FROM mealPreferences WHERE (mealPreferences.user_dbid = ?)";
    connection.query(query, req.query.user_dbid, function(error, data) {
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