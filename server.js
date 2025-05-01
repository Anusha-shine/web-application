const express = require("express")
const app = express();
const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")
const path = require("path");
const connectDB = require("./db/connectDB");
const session = require('express-session');
const nocache = require('nocache');


app.use(nocache());
app.use(session({
    secret: 'mysecretkey',
    resave:false,
    saveUninitialized:true,
    cookie: {
        maxAge: 1000*60*60*24
    }
}));

//view engine setup
app.set("views",path.join(__dirname,"views"));
app.set("view engine","hbs");
app.use(express.static(path.join(__dirname,'public')));



app.use(express.urlencoded({extended:true}));
app.use(express.json());


app.use("/user",userRoutes)
app.use("/admin",adminRoutes)

connectDB();

app.use((req,res,next)=>{
    res.status(404).send("404 Not Found. Check the URL")
    next();
});

app.listen(4004, ()=> {
    console.log("server running on port 4004");
});