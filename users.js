const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
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




//app.get("/users/:email", function(req, res) {
//app.get("/users/:email/:password", function(req, res) {
app.get("/users", function(req, res) {
    //const query = "SELECT * FROM `users` WHERE ((`users`.`email` = ?) AND (`users`.`password` = ?)) LIMIT 1";
    const query = "SELECT * FROM `users` WHERE `email` = ? AND `password` = ?";
    //const query = "SELECT * FROM `users` WHERE (`users`.`email` = ?)";
    //const query = "SELECT * FROM `users` WHERE (users.email = ?)";
      //connection.query(query, [req.query.email, req.query.password], function(error, data) {
      //connection.query(query, [req.body.email, req.body.password], function(error, data) {
      //connection.query(query, [req.params.email, req.params.password], function(error,data) {
      connection.query(query, [req.query.email, req.query.password], function(error, data) {
      //connection.query(query, req.params.email, function(error,data) {
      if(error) {
        console.log("Login Error", error);
        res.status(500).json({
          error: error
        });
      } else {
        res.status(200).json({
          email: data
        });
      }
    });
  });
  
  app.post("/users", function(req, res) {
      const query = "INSERT INTO `users` (user_dbid, firstName, surname, email, password) VALUES ('', ?, ?, ?, ?)";
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
