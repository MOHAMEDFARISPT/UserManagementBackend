var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');




const cors=require('cors')
var AdminRouter = require('./routes/Admin');
var usersRouter = require('./routes/users');
var app = express();

require('./utilities/DataBaseConnection');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Serve static files from the "uploads" directory
app.use('/uploads', express.static('uploads'));

app.use(logger('dev'));
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:['http://localhost:4200']
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/users', usersRouter);
app.use('/api/Admin',AdminRouter);



app.use((obj, req, res, next) => {
  console.log(obj)
  const statusCode = obj.status || 500;
  const errorMessage = obj.message || "Something went wrong";
  
  const jsonResponse = {
      success: [200, 201, 204].some(a => a === obj.status) ? true : false,
      status: statusCode,
      message: errorMessage
  };

  if (obj.data !== undefined) {
      jsonResponse.data = obj.data;
  }

  return res.status(statusCode).json(jsonResponse);
});




const port = process.env.port || 4000;

// Start the server
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

module.exports = app;
