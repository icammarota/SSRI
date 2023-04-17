require("dotenv").config();
require('./db/mongoose');
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const adminRouter = require('./db/routers/adminRouter');
const userRouter = require('./db/routers/userRouter');
const bookRouter = require('./db/routers/bookRouter');

const app = express();
const port = process.env.PORT;

app.use(express.static(path.join(__dirname,'../public')));

const viewPath = path.join(__dirname,'../views');

app.set('view engine','hbs');
app.set('views',viewPath);


const mongoose = require('./db/mongoose');
app.get('/api/uptime', function(req,res){
  res.json({healthy: mongoose.STATES[mongoose.connection.readyState] }).send();
});

/*app.use(express.json());*/

app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({limit: '200mb', extended: true}));

app.use(adminRouter);
app.use(userRouter);
app.use(bookRouter);

app.listen(port, ()=>{
    console.log('Server is online on port: ',port);
});