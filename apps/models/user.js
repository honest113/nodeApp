// thao tac voi table user
var q = require("q");
var db = require("../common/database");

var conn = db.getConnection();

function addUser(user) {
    if (user) {
        var defer = q.defer();
        var query = conn.query('INSERT INTO users SET ?', user, function (err, result) {
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

function getUserByEmail(email) {
    if (email) {
        var defer = q.defer();
        var query = conn.query('SELECT * FROM users WHERE ?', { email: email }, function (err, result) {
            if (err) {
                defer.reject(err);
            } else {
                defer.resolve(result); // return 1 array
            }
        })
        return defer.promise;
    }
    return false;
}

function getAllUsers() {
    var defer = q.defer();
    var query = conn.query('SELECT * FROM users', function (err, users) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(users); // return 1 array
        }
    })
    return defer.promise;
}

// phai co module.export thi ben controller moi require dc va sd ham adduser
module.exports = {
    addUser: addUser,
    getUserByEmail: getUserByEmail,
    getAllUsers: getAllUsers
}