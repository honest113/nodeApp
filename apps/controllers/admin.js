var express = require("express");
var router = express.Router();

var user_md = require("../models/user");
var post_md = require("../models/posts");

var helper = require("../helpers/helper");
const { hash_password } = require("../helpers/helper");

router.get("/", function (req, res) {
    if (req.session.user) {
        // res.json({ "message": "This is Admin Page" });
        var data = post_md.getAllPosts();  // return -> promise
        data.then(function (posts) {
            var data = {
                posts: posts,
                error: false
            };
            res.render("admin/dashboard", { data: data });
        }).catch(function (err) {
            res.render("admin/dashboard", { data: { error: "Get Post data err" } });
        });
    } else {
        res.redirect("/admin/signin");
    }
})

router.get("/signup", function (req, res) {
    res.render("signup.ejs", { data: {} });   // day du lieu cho form
})

router.post("/signup", function (req, res) {
    var user = req.body;    // chua thong tin cua cac tt nam trong form
    let check = true;

    if (user.email.trim().length == 0) {
        check = false;
        res.render("signup.ejs", { data: { error: "Email is required" } });
    }

    if (user.passwd != user.repasswd && user.passwd.trim().length != 0) {
        check = false;
        res.render("signup.ejs", { data: { error: "Password is not matched" } });
    }

    if (check) {
        var password = helper.hash_password(user.passwd);
        // insert db
        user = {
            email: user.email,
            password: password,
            first_name: user.firstname,
            last_name: user.lastname
        }

        var result = user_md.addUser(user);  //promise

        result.then(function (data) {
            // res.json("Insert success");
            res.redirect("/admin/signin");
        }).catch(function (err) {
            res.render("signup.ejs", { data: { error: err } });
        })
    }

})

router.get("/signin", function (req, res) {
    res.render("signin.ejs", { data: {} });
})

router.post("/signin", function (req, res) {
    var params = req.body;

    if (params.email.trim().length == 0) {
        res.render("signin.ejs", { data: { error: "Please enter an email!" } });
    } else {
        var data = user_md.getUserByEmail(params.email);
        if (data) {
            data.then(function (users) {
                var user = users[0];

                var status = helper.compare_password(params.password, user.password);
                if (!status) {
                    res.render("signin.ejs", { data: { error: "Password Wrong" } });
                } else {
                    // day data user vao session
                    req.session.user = user;  // luu tru user vao trong session
                    // console.log(req.session);
                    res.redirect("/admin");
                }
            })
        } else {
            res.render("signin.ejs", { data: { error: "User not exists" } });
        }
    }
})

router.get("/post", function (req, res) {
    if (req.session.user) {
        res.redirect("/admin");
    } else {
        res.redirect("/admin/signin");
    }

})

router.get("/post/new", function (req, res) {
    if (req.session.user) {
        res.render("admin/post/new.ejs", { data: { error: false } });
    } else {
        res.redirect("/admin/signin")
    }
})

router.post("/post/new", function (req, res) {
    var params = req.body;

    if (params.title.trim().length == 0) {
        let data = { error: "Please enter a title" };
        res.render("admin/post/new", { data: data });
    } else {
        let now = new Date();
        params.created_at = now;
        params.updated_at = now;

        var data = post_md.addPost(params);  // data = promise
        data.then(function (result) {
            res.redirect("/admin");
        }).catch(function (err) {
            let data = { error: "Could not insert post" };
            res.render("admin/post/new.ejs", { data: data });
        })
    }


})

router.get("/post/edit/:id", function (req, res) {
    if (req.session.user) {
        var params = req.params;    // req.params -> lay parameter tren duong dan route, no khac voi req.body -> lay cac cap key-value dc gui len trong body request
        var id = params.id;

        var data = post_md.getPostByID(id);
        data.then(function (posts) {
            var post = posts[0];
            var data = {
                post: post,
                error: false
            };
            res.render("admin/post/edit", { data: data });
        }).catch(function (err) {
            var data = { error: "Could not get post" };
            res.render("admin", { data: data })
        })
    } else {
        res.redirect("/admin/signin");
    }

})

router.put("/post/edit", function (req, res) {
    var params = req.body;

    var data = post_md.updatePost(params);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 })
        })
    }
})

router.delete("/post/delete", function (req, res) {
    var post_id = req.body.post_id;
    // console.log(post_id);
    var data = post_md.deletePost(post_id);

    if (!data) {
        res.json({ status_code: 500 });
    } else {
        data.then(function (result) {
            res.json({ status_code: 200 });
        }).catch(function (err) {
            res.json({ status_code: 500 });
        })
    }
})

router.get("/user", function (req, res) {
    if (req.session.user) {
        var data = user_md.getAllUsers();
        data.then(function (users) {
            let data = {
                users: users,
                error: false
            }
            res.render("admin/user.ejs", { data: data });
        }).catch(function (err) {
            res.render("admin/user", { data: { error: "Could not get User info" } });
        })
    } else {
        res.redirect("/admin/signin");
    }
})

module.exports = router;