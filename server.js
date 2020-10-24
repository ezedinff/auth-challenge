const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");

const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());


// Connect to MongoDB
require("./config/db")();

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

//app.use("/", (req,res) => res.send("API is alive"));
// Routes
app.use("/api/users", users);

app.use(express.static('client/build'));

const path = require('path');
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
