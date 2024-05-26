const express = require('express');
const router = express.Router();

const {login , signup} = require('../Controllers/Auth');
const {auth , isStudent , isAdmin} = require('../middlewares/auth')

//mapping the routes
router.post('/login' , login);
router.post('/signup',signup);

//protected routes
router.get("/student" , auth , isStudent , (req,res) => {
    return res.json({
        success:true,
        message:"Welcome to student protected route"
    })
})

router.get("/admin" , auth , isAdmin , (req,res) => {
    return res.json({
        success:true,
        message:"Welcome to admin protected route"
    })
})

module.exports = router