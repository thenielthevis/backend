const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
// const products = require('./routes/product');
// const auth = require('./routes/auth');
// const order = require('./routes/order');

app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cors({
    origin: 'http://localhost:5173/',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Expires",
        "Pragma"
    ],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());

// app.use('/api/v1', products);
// app.use('/api/v1', auth);
// app.use('/api/v1', order);


module.exports = app