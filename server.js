const express = require('express');
const mongoose = require('mongoose');

const db = require('./config/keys').MongoURI;

const app = express();

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(3001, console.log('Server has opened on port 3001'));