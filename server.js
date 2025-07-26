// Imports 
import express from "express";
import dotenv from "dotenv";

//dot env configuration
dotenv.config();

//Rest Objects 
const app = express();

//Routes
app.get('/', (req, res) => {
  res.send('<h1>Hello World!!!</h1>');
});

//Port configuration
const PORT = process.env.PORT || 8000;

// listen on port 8000
app.listen(PORT, () => {
  console.log(`Node Server running in ${process.env.DEV_MODE} on port ${PORT}`);
})