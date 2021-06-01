var express = require("express");
var router = express.Router();

var post_md = require("../models/posts");

router.get("/", function(req, res) {
    // res.json({"message": "This is Blog Page"});
    var data = post_md.getAllPosts();
    data.then(function(posts) {
        let result = {
            posts: posts,
            error: false
        }
        res.render("blog/index.ejs", {data: result})
    }).catch(function(err) {
        res.render("blog/index.ejs", {data: {error: "Could not get posts data"}});
    })
    // res.render("blog/index.ejs")
})

router.get("/post/:id", function(req, res) {
    var data = post_md.getPostByID(req.params.id);
    data.then(function (posts) {
        var post = posts[0];
        let result = {
            post : post,
            error : false
        }
        res.render("blog/post.ejs", {data: result});
    }).catch(function(err) {
        res.render("blog/post.ejs", {data: {error: "Could not get post detail"}});
    })
})

router.get("/about", function(req, res) {
    res.render("blog/about.ejs");
})

module.exports = router;