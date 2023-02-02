const express = require('express');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
dotenv.config();
app.use(bodyParser.json());
//db
mongoose.connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
  console.log("DATABASE CONNECTED");
});
const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", function() {
    console.log("Connected to the database");
  });

  //USING OPTIONS
  app.options('/', (req, res) => {
    // Set headers for CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    // Send a 200 OK response
    res.sendStatus(200);
  });
  //post method
  app.post("/create", (req, res) => {
    const data = { name: req.body.name, email: req.body.email, password: req.body.password };
    db.collection("data").insertOne(data, (err, result) => {
      if (err) throw err;
      console.log("Data inserted successfully");
      res.send({ message: "Data inserted successfully",id:result.insertedId });
    });
  });
  //get method
  app.get("/data/:id", (req, res) => {
    const id = req.params.id;
    db.collection("data").findOne({ _id: mongoose.Types.ObjectId(id) }, (err, result) => {
      if (err) throw err;
      if (!result) {
        return res.status(404).send({ message: "Data not found" });
      }
      res.send(result);
    });
  });
  //delete method
  app.delete("/data/:id", (req, res) => {
    const id = req.params.id;
    db.collection("data").deleteOne({ _id: mongoose.Types.ObjectId(id) }, (err, result) => {
      if (err) throw err;
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Data not found" });
      }
      res.send({ message: "Data deleted successfully" });
    });
  });

  //put method
  app.put("/data/:id", (req, res) => {
    const id = req.params.id;
    const data = { name: req.body.name, email: req.body.email, password: req.body.password };
    db.collection("data").updateOne({ _id: mongoose.Types.ObjectId(id) }, { $set: data }, (err, result) => {
      if (err) throw err;
      if (result.modifiedCount === 0) {
        return res.status(404).send({ message: "Data not found" });
      }
      res.send({ message: "Data updated successfully" });
    });
  });
  

  app.listen(4000, () => {
    console.log('Server started on port 4000');
  });