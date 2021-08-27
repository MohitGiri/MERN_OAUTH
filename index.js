const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport')

const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user")
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")

const app = express();




mongoose.connect('mongodb://localhost:27017/cstestDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
}).then(()=>console.log("DATABASE CONNECTED"));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());





// Routes
app.use("/api",authRoutes)
app.use("/api",userRoutes)
app.use("/api",categoryRoutes)
app.use("/api",productRoutes)
app.use("/api",orderRoutes)

// CHANGED the port from 3000 to 8000

app.listen(8000,()=>{
    console.log("Server started")
})
// CHANGED from 3000 to 8000
const API = 'http:localhost:8000/api/'
