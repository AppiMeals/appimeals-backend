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
  
  module.exports.handler = serverless(app);