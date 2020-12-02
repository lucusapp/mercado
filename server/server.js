require ('./config/config');

const express = require('express');
const mongoose = require('mongoose')
const app = express();
const cors = require("cors");


app.use(cors({ origin: "http://localhost:4200" }));
app.options("*", cors());

const bodyParser = require ('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// importamos y usamos rutas
app.use("/",require('./rutas/aliscraper'));


mongoose.connect('mongodb+srv://lucusapp:romimu1111@cluster0-49zbz.mongodb.net/productos?retryWrites=true&w=majority', { useUnifiedTopology: true, useNewUrlParser: true  }, (err,res)=>{
  if (err) throw err;

  console.log('base de datos online')
})

app.listen(process.env.PORT, function () {
  console.log('Example app listening on port 3000!');
});
