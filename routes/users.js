const express = require('express');
const router= express.Router();
const passport = require('passport-jwt');
const passport2 = require("passport");
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const config= require('../config/database');
//Register 
//console.log("passport2",passport2);
router.post("/register",(req,res,next) => {
  
  let newUser= new User({
      name: req.body.name, 
      email:req.body.email,
      username:req.body.username,
      password:req.body.password
  });

  User.addUser(newUser , (err,user)=>{
      if(err){
          res.json({success:false,msg:"failed to Registered"});
      }
      else{
          res.json({success:true,msg:"User Registered"});
      }
  })

});

//Autheticate 
router.post("/authenticate",(req,res,next) => {
 
 const username =  req.body.username;
 const password = req.body.password;

 User.getUserByName(username,(err,user)=>{
     if(err) throw err;

     if(!user){
         return res.json({success:false , msg:"user not found !"})
     }
     User.comparePassword(password,user.password,(err,isMatch)=>{
         if(err) throw err;
         if(isMatch){
             const token = jwt.sign(user,config.secret,{expiresIn:604800 //1 week 
             })
             res.json({
                 success:true ,
                 token: 'JWT'+token,
                 user:{
                     id:user._id,
                     name:user.name,
                     username:user.username,
                     email:user.email
                 }
             })
         }else{
             return res.json({success:false,msg:"Wrong Password"});
         }
     })
 })

});

//Profile 
router.get("/profile",passport2.authenticate('jwt',{sessin:false}),(req,res,next) => {
 
 res.json({user: req.user});

});


module.exports= router; 