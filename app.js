var express = require("express");
var config = require("config")
var bodyParser = require("body-parser")
var session = require('express-session')
var socketio = require("socket.io");

var app = express();


app.use(express.json());
// lay dc body trong form gui len
app.use(express.urlencoded({extended: true}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: config.get('secret_key'),
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }   // cho phep luu du lieu khac vao
}))

// set up thu muc view -> template engine
app.set("views", __dirname + "/apps/views");
// set up ejs = template engine mac dinh
app.set("view engine", "ejs");  // tat ca nhung file co phan mo rong duoi la .ejs trong thu muc views thi deu duoc nhan la template va duoc render ra trong bien response cua express

// static folder
app.use("/static", express.static(__dirname + "/public"));

// tao router o controller va include router vao application (app.js)
var controllers = require(__dirname + "/apps/controllers")
app.use(controllers);

var host = config.get("server.host");
var port = config.get("server.port");

var server = app.listen(port, host, function() {
    console.log("Server is running on port ", port);
})

var io = socketio(server);

var socketControl = require("./apps/common/socketcontrol")(io);  // ham khoi tao