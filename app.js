const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
// const methodOverride = require("method-override");
// const exphbs = require("express-handlebars");
// const bodyParser = require("body-parser");
// const passport = require("passport");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
const User = require("./api/models/user");
const userRoute = require("./api/routes/user");
const gameRoute = require("./api/routes/game");

const app = express();
require("dotenv").config();
const config = require("./config/app_config");

app.use(morgan("Dev"));

// Body parser
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

app.use(cors());

// Passport config
// require("./middleware/passport")(passport);

// Initializes passport and passport sessions
// app.use(passport.initialize());
// app.use(passport.session());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization;"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use("/user", userRoute);
app.use("/game", gameRoute);

app.get('/', (req, res) => res.send('Success'))

app.use((request, response, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 200);
  response.json({
    error: {
      message: error.message,
    },
  });
});

mongoose
  .connect(config.mongodbUri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database.", err);
    process.exit();
  });

module.exports = app;
