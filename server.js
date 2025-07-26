// Imports 
const express = require("express");

//Rest Objects 
const app = express();

//Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World!!!</h1>');
});

// listen on port 8000
app.listen(8000, () => {
  console.log('Node Server is running on port 8000');
})