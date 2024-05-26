const jwt = require('jsonwebtoken')

exports.auth = async(req,res,next) => {
    try {
        const token = req.cookies.Token || req.body.token || req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.json({
                success:false,
                message:"Token missing"
            })
        }

        try {
            const decode = jwt.verify(token , process.env.JWT_SECRET);
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Unable to verify the token"
            })
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Unable to authenticate"
        })
    }
}

exports.isStudent = (req,res,next) => {
    try {
        const role = req.user.accountType;

        if(role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student",
            })
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Unable to verfy student route"
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try {
        const role = req.user.accountType;

        if(role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for admin",
            })
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Unable to verfy admin route"
        })
    }
}