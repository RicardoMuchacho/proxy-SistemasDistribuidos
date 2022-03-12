
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const db = require("./db.js")
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require("./auth.js");

app.use(express.json());
app.use(morgan('dev'));
dotenv.config();

app.get('/', (req, res)=>{
   //
})

app.post('/register', async (req, res)=>{

  try{
    const {username , pass } = req.body;
   
    if (!(username && pass)) {
      return res.status(400).send("All input is required");
    }

    const old_user = await User.findOne({ username: username });
 
    if (old_user) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    encryptedPassword = await bcrypt.hash(pass, 10);

    const user = await User.create({
      username,
      password: encryptedPassword,
    });

    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;

    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }

});

app.post("/login", async (req, res) => {
  try {
 
    const { username, pass } = req.body;

    // Validate user input
    if (!(username && pass)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});

app.get("/auth_test", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

app.get('/signout', (req, res)=>{
    req.session.destroy();
})

app.get('/users', (req, res)=>{
//
})

app.delete('/users', (req, res)=>{
      db.deleteUser(req.session.userid);
  })

app.put('/users', (req, res)=>{
    try{
      newName = req.body.name;
      newPass = req.body.pass;
      newEmail = req.body.email;
      db.updateUser(req.session.userid, newName, newEmail, newPass)
      
      req.session.name = newName;
      req.session.email = newEmail;
      req.session.password = newPass;
      res.send(JSON.stringify("Succesful"));
      res.redirect("/users");

    }catch{(err => console.log(err))}
  })


const PORT = process.env.PORT || 5000

const dbURI = procces.env.MONGO_URI

mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(result => {
    console.log("connected to db");
    console.log("running on port: "+PORT);
    app.listen(PORT);
})
.catch((err) => console.log(err));