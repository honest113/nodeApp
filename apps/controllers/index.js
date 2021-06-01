var express = require("express");
var router = express.Router();

// include admin.js va blog.js
// build router
router.use("/admin", require(__dirname + "/admin.js"));   // url_prefix: admin.js = /admin
router.use("/blog", require(__dirname + "/blog.js"));     // url_prefix: blog.js  = /blog

// router dung chung cho toan bo he thong
router.get("/", function(req, res) {
    // res.json({"message": "This is Home Page"});
    // res.render("test.ejs");
    res.redirect("/blog");
})

router.get("/chat", function(req, res) {
    res.render("chat.ejs");
})

module.exports = router;