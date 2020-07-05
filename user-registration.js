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

app.get("/tasks", function(req, res) {
  // const query = "SELECT * FROM tasks";
  const query = "SELECT * FROM tasks WHERE (tasks.user_id = ?)";
  //connection.query(query, function(error, data) {
    connection.query(query, req.query.user_id, function(error, data) {
    if(error) {
      console.log("Error fetching tasks", error);
      res.status(500).json({
        error: error
      });
    } else {
      res.status(200).json({
        tasks: data
      });
    }
  });
});

app.post("/tasks", function(req, res) {

  const query = "INSERT INTO `tasks` VALUES (?, ?, ?, ?)";


  connection.query(query, [req.body.task_id, req.body.user_id, req.body.text, 
      req.body.complete_status_id], function(error,data) {
    if (error){
        console.log("Error inserting task", error);
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


app.delete("/tasks/:taskId", function(req, res) {
/*
  For purposes of this week's homework, delete queries and such are written below.
  However for purposes of my database, tasks are meant to be 'archived' so the 
  query would be changed to an update query where complete_status_id is changed to 3.
*/
  const query = "DELETE FROM `tasks` WHERE (`tasks`.`task_id` = ?)";
  connection.query(query, [req.params.taskId], function(error){
    if (error){
      console.log("Error deleting task", error);
      res.status(500).json({
        error: error
      });
    }
    else {
      res.sendStatus(200);
    }
  });
});

app.put("/tasks/:taskId", function(req, res) {
  const query = "UPDATE `tasks` SET `tasks`.complete_status_id = ? WHERE (`tasks`.`task_id` = ?)";
  
  connection.query(query,[req.body.complete_status_id, req.params.taskId], function (error){
    if (error){
      console.log("Error updating task", error);
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