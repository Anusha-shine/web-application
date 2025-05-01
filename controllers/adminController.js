const adminModel = require('../models/adminModel');
const adminSchema = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const saltround = 10;
const userModel = require('../models/userModel');
const User = require('../models/userModel');



const loadLogin = (req,res) => {
    res.render('admin/login')
} 

const login = async (req,res) => {
    try {
        
const adminVerify = await adminSchema.findOne({email: req.body.email});

        if(!adminVerify) return res.render('admin/login', {message: 'Invalid credentials'});

        const isMatch = await bcrypt.compare(req.body.password, adminVerify.password);

        if(!isMatch) return  res.render('admin/login', {message:'Incorrect password'});
        req.session.admin = true;
        res.redirect('/admin/dashBoard');




    } catch(error) {

        res.send(error);

    }
}

const loadDashboard = async (req,res) =>{
    try{

        const admin = req.session.admin;
        if(!admin) return res.redirect('/admin/login');

        const users = await userModel.find({});
        //add serial numbers
        const userWithSerial = users.map((user,index) => ({
            ...user.toObject(),
            serialNumber: index + 1
        }));

        res.render('admin/dashboard',{users: userWithSerial});

    } catch (error) {
        console.error("Error loading dashboard",error);
        res.status(500).send("Internal Server Error");

    }

};

const editUser = async (req,res) => {
    try{

        const {email,password,id} = req.body;
        
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await userModel.findOneAndUpdate({_id:id},{email,password: hashedPassword},{new: true}); 

        res.redirect('/admin/dashboard');

    } catch(error) {

        console.log(error);
        res.status(500).json({error: "Internal Server Error"});

    }
}

const deleteUser = async (req,res) => {
    try {
        const {id} = req.params
        const user = await userModel.findOneAndDelete({_id:id});

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
    }

}

const addUser = async (req,res) => {
    try {

        const {id,name,email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel ({
            name,
            email,
            password: hashedPassword
        })
        console.log(req.body)
        await newUser.save();

        res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error);
    }
}

const logout = async (req,res) => {
    req.session.admin = null;
   
    res.redirect('/admin/login')
}

const search = async (req,res)=> {
    try{
        const query = req.query.query;
        
        const users= await User.find({
            $or:[
                {name:{$regex: query, $options:'i'}},
                {email:{$regex:query, $options:'i'}}
            ]
        });
        
        res.render('admin/dashboard',{users});

    } catch(error) {
        console.error(error);
        res.status(500).send('Error searching users');

    }
};


module.exports = {loadLogin,login,loadDashboard,editUser,deleteUser,addUser,logout,search}


