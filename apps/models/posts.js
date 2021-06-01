// thao tac voi table post
var q = require("q");
var db = require("../common/database");

var conn = db.getConnection();

function getAllPosts() {
    var defer = q.defer();  //dung defer -> tra ve promise
    var query = conn.query("SELECT * FROM posts", function(err, posts) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(posts);
        }
    })
    return defer.promise;
}

function addPost(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('INSERT INTO posts SET ?', params, function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function getPostByID(id) {
    var defer = q.defer();  //dung defer -> tra ve promise
    var query = conn.query("SELECT * FROM posts WHERE ?", {id: id}, function(err, posts) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(posts);
        }
    })
    return defer.promise;
}

function updatePost(params) {
    if (params) {
        var defer = q.defer();
        var query = conn.query('UPDATE posts SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?', [params.title, params.content, params.author, new Date(), params.id], function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function deletePost(post_id) {
    if (post_id) {
        var defer = q.defer();
        var query = conn.query('DELETE FROM posts WHERE id = ?', [post_id], function(err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

module.exports = {
    getAllPosts: getAllPosts,
    addPost: addPost,
    getPostByID: getPostByID,
    updatePost: updatePost,
    deletePost: deletePost
}