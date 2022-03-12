
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
const mongoose = require('mongoose');
const User = require('./models/user');
const Animal = require('./models/animal');
const auth = require('./auth.js');

mongoose.set('useFindAndModify', false);

app.use(express.json());
app.use(morgan('dev'));


app.get('/animals', auth,  async (req, res)=>{
    animals = await Animal.find({}, 'name');
    console.log(animals);
    res.send(JSON.stringify(animals));
})

app.post('/animals', auth,  async (req, res)=>{
    animal_name = req.body.name;
    console.log(animal_name);
    const animal = new Animal({
        name: animal_name
     })
     animal.save().then(result =>{
         console.log(result);
         res.send(JSON.stringify(result));
     }).catch(err => console.log(err));

})

app.put('/animals', auth , async (req, res)=>{

    prev_name = req.body.prev_name;
    new_name = req.body.new_name;

    const query = { name: prev_name };

    r = await Animal.findOneAndUpdate(query, { name: new_name },{
        new: true
      });
    res.send(JSON.stringify(r));
})

app.delete('/animals', auth,  async (req, res)=>{

    delete_name = req.body.name;

    //r = await Animal.deleteOne({ name: delete_name});

    r = await Animal.findOneAndDelete({name: delete_name })
    res.send(JSON.stringify("Deleted, " +r));
})


const PORT = process.env.PORT || 3000

const dbURI = procces.env.MONGO_URI

mongoose.connect(dbURI, {useNewUrlParser:true, useUnifiedTopology:true})
.then(result => {
    console.log("connected to db");
    console.log("running on port: "+PORT);
    app.listen(PORT);
})
.catch((err) => console.log(err));