const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.login = async(req ,res) => {
    try{

        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Fill all entries"
            })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User does not exist"
            })
        }

        if(await bcrypt.compare(password , user.password)){

            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }

            const token = jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn:"2h"
            })

            user.token = token;
            user.password = undefined;


            const options = {
                expires : new Date(Date.now() + 30000),
                httpOnly:true
            }

            res.cookie("Token" , token , options).status(200).json({
                success:true,
                user,
                message:"Logged In"
            })
        }

        else{
            return res.status(401).json({
                success:false,
                message:"Unable to login"
            })
        }

    }
    catch(error) {
         return res.status(400).json({
            success:false,
            message:"Something went wrong"
         })
    }
}

exports.signup = async(req ,res) => {
    try{
       const {accountType , userName , password , confirmPassword , email} = req.body;

       if(!userName || !email || !accountType || !password || !confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Entries are missing"
        })
       }

       if(password !== confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Both passwords does not match"
        })
       }

       const existingUser = await User.findOne({email});

       if(existingUser){
         return res.status(400).json({
            success:false,
            message:"User already exists"
         })
       }

       const existingUserName = await User.findOne({userName});

       if(existingUserName){
        return res.status(400).json({
           success:false,
           message:"User name already exists"
        })
      }

       //hashing the password and retrying if unable to fetch
       let hashedPassword;
       const maxRetries = 3; // Maximum number of retries
       let retryCount = 0;

       while(retryCount < maxRetries){
           try{
            hashedPassword = await bcrypt.hash(password , 10);
            break;
           }
           catch(error){
            console.log("Error in hashing the password -- trying again");
            retryCount++;
           }
       }

       if(retryCount === maxRetries){
        return res.status(500).json({
            success:false,
            message:"Unable to hash the password"
        })
       }

       //ceating a new user
       const newUser = new User({
        userName , email ,password:hashedPassword , accountType
       })

       await newUser.save();

       return res.status(200).json({
        success:true,
        message:"User created successfully"
       })
    }
    catch(error){
       console.error(error);
       return res.status(401).json({
        success:false,
        message:"Something gone wrong while sigining Up"
       })
    }
}