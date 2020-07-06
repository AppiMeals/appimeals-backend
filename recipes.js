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


app.get("/browse-recipes", function (req, res) {

  axios.get(`https://api.edamam.com/search?q=chicken&app_id=fce15b25&app_key=8b32dc22c438268e5fc874e29967d9fa&from=0&to=10&calories=591-722`)
    .then(function (response) {
      //If request is successful
      res.json(response.data)
    })
  .catch(function (error) {
    // handle error
    console.error(error);
    res.status(500).json({ error })
  })
});


module.exports.handler = serverless(app);