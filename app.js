const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect("mongodb+srv://kesava07:<password>@cluster0-wx6ar.mongodb.net/node-angular?retryWrites=true&w=majority")
    .then(() => {
        console.log("connected")
    }).catch(() => {
        console.log("Error while connecting");
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use("", require('./backend/Routes'));

app.listen(process.env.PORT || 5050);
