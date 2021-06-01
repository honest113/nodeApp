// cac ham dung chung cho toan bo project

var bcrypt = require("bcrypt");
var config = require("config");

function hash_password(password) {
    var saltRounds = config.get("salt");

    var salt = bcrypt.genSaltSync(saltRounds);  //gen salt
    var hash = bcrypt.hashSync(password, salt);  // hash pw

    return hash;
}

function compare_password(password, hash) {
    return bcrypt.compareSync(password, hash);
}

// export module -> su dung dc trong file khac
module.exports = {
    hash_password: hash_password,
    compare_password: compare_password
}