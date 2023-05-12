const sha1 = require('sha1');
const fs = require('fs');

function isAnyUndefined(...args) {
    return args.some(arg => typeof arg === 'undefined');
}

function isValueExists(arr, key, value) {
    return arr.some(item => item[key] === value);
}

function updateJSON(path, json) {
    const updatedJsonData = JSON.stringify(json, null, 2);
    fs.writeFileSync(path, updatedJsonData);
}

function newUser(name, pass, mail) {
    const user = {
        username: name,
        password: pass,
        mail: mail,
        userid: sha1(name + 'salt' + pass)
    };
    return user;
}

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}


module.exports = { isAnyUndefined, isValueExists, updateJSON, newUser, isValidEmail };