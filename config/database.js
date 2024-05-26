const mongoose = require('mongoose');

const DATABASE_URL = process.env.DATABASE_URL;

const dbConnect = () => {
    mongoose.connect(DATABASE_URL , {})
    .then(() => {console.log("Connected to Database Successfully")})
    .catch((error) => {
        // console.error(error);
        process.exit(1);
    })
}

module.exports = dbConnect;