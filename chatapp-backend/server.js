const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const http = require("http");
const _ = require("lodash");
const app = express();

// create http server and bind the Express listener instance to it
const server = http.createServer(app);

// create socket.io server and bind it to the existing http server
const io = require("socket.io")(server);
const {User} = require("./Helpers/UserClass");
require('./socket/streams')(io,User,_);
require('./socket/private')(io);

const dbConfig = require("./config/secret");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(logger("dev"));
app.use(cors());
// Add headers before the routes are defined
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const auth = require("./routes/authRoutes");
const posts = require("./routes/postRoutes");
const users = require("./routes/userRoutes");
const friends = require("./routes/friendsRoutes");
const message = require("./routes/messageRoutes");
const image = require("./routes/imageRoutes");

app.use("/api/chatapp", auth);
app.use("/api/chatapp", posts);
app.use("/api/chatapp", users);
app.use("/api/chatapp", friends);
app.use("/api/chatapp", message);
app.use("/api/chatapp", image);

server.listen(3000, () => {
  console.log("Running on port 3000");
});
