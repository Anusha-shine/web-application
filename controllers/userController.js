const userSchema = require("../models/userModel");
const bcrypt = require('bcryptjs');
const saltround = 10;

const registerUser = async(req,res) => {
    try{
        const {name,email,password} = req.body;

        const user = await userSchema.findOne({ email })

        if(user) return res.render('user/register', {message:  'User already exists'});

        const hashedPassword = await bcrypt.hash(password,saltround);

        const newUser = new userSchema({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.render('user/login',{message: 'User created successfully'});

    } catch(error) {

        res.render('user/register', {message: "Something went wrong"});

    }
}

const logout = (req,res) => {
    req.session.user = null
    res.redirect('/user/login')
}

const login = async (req,res) => {
    try{


        const userVerify = await userSchema.findOne({email: req.body.email});

        if(!userVerify) return res.render('user/login', {message: 'user doesnot exist'});

        const isMatch = await bcrypt.compare(req.body.password, userVerify.password);

        if(!isMatch) return  res.render('user/login', {message:'Incorrect password'});
        req.session.user = true;
        res.redirect('/user/home');

    } catch(error) {

        res.render('user/login', {message: "Something went wrong"});

    }

}

const loadRegister = (req,res) => {
    res.render('user/register')
};

const loadLogin = (req,res) => {
    res.render('user/login');
}

const loadHome = (req,res) => {
    res.render('user/userhome');
}

module.exports = {registerUser,loadRegister,loadLogin,login,loadHome,logout}