const sha1 = require('sha1');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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
        userid: sha1(uuidv4()),
        profileUrl: "https://github.com/GroophyLifefor/GroophyLifefor/assets/77299279/b73bfbb8-292c-4144-963f-e25c2543169c"
    };
    return user;
}

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}




module.exports = { isAnyUndefined, isValueExists, updateJSON, newUser, isValidEmail };