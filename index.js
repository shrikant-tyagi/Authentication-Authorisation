const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.listen(PORT , () => {
    console.log(`Server started at port ${PORT}`);
})

app.use(express.json());
app.use(cookieParser());

//maping to route
const route = require('./Routes/auth');
app.use('/api/v1' , route);

//connecting to db
const dbConnect = require('./config/database');
dbConnect();