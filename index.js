// ADDING REQUIREMENTS 
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
require('./Sequelize');
require('dotenv').config()

// INIT EXPRESS
const app = express()
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// INCLUDING ROUTES
const GeneralRouter = require('./Routes/GeneralRouter');
app.use("/", GeneralRouter);
const ProfRouter = require('./Routes/ProfRouter');
app.use("/prof", ProfRouter);
const AdminRouter = require('./Routes/AdminRouter');
app.use("/admin", AdminRouter);
const APIRouter = require('./Routes/APIRouter');
app.use("/api", APIRouter);
// SETTING PUBLIC FOLDER
app.use(express.static(path.join(__dirname, 'Public')));

// INIT LOGGER
app.use(logger('dev'));

// STARTING THE SERVER
const SERVER_PORT = 4000
app.listen(SERVER_PORT, () => console.log("Server started on port : " + SERVER_PORT))