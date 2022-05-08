/*
    Full credits for code go to:
        XyzMarked (Magic#1661)

    Enjoy!
*/

//Configs.
require('dotenv').config();
const { MaximumRank, ApiSerial, ApiKey } = require('./config.json');
const Cookie = process.env["RobloxSecurityCookie"];

//Set up server.
const express = require('express');
var app = express();

//Set up noblox.js.
const noblox = require('noblox.js');
async function nobloxSetup() {
    const User = await noblox.setCookie(Cookie);
    console.log(`Noblox: Logged in as ${User.UserName} [${User.UserID}].`);
};
nobloxSetup();

//Random functions. 
async function authenticate(serial, key) {
    if (serial !== ApiSerial || key !== ApiKey) {
        return false;
    };
    return true;
};

async function handleErrors(res,err) {
    console.warn(err);
    res.send("Something has failed, the error has been logged.");
    return;
};

//Get request to homepage, simple up and running response.
app.get('/', function(req, res) {
    res.send("Up and running.");
});

//Actual requests for ranking.
app.post('/v1/promote/:serial/:key/:groupid/:userid', function(req,res) {
    const isAllowed = await authenticate(req.params.serial, req.params.key);
    if (isAllowed == false) {
        res.send("Api Serial Number / Api Key / both invalid.");
        return;
    };

    noblox.promote(req.params.groupid, req.params.userid).catch(function(err){handleErrors(res,err);return;});
    res.send("Success.");
});

app.post('/v1/demote/:serial/:key/:groupid/:userid', function(req, res) {
    const isAllowed = await authenticate(req.params.serial, req.params.key);
    if (isAllowed == false) {
        res.send("Api Serial Number / Api Key / both invalid.");
        return;
    };

    noblox.demote(req.params.groupid, req.params.userid).catch(function(err){handleErrors(res,err);return;});
    res.send("Success.");
});

app.post('/v1/setrank/:serial/:key/:groupid/:userid/:rankid', function(req, res) {
    const isAllowed = await authenticate(req.params.serial, req.params.key);
    if (isAllowed == false) {
        res.send("Api Serial Number / Api Key / both invalid.");
        return;
    };

    if (req.params.rankid > MaximumRank) {
        res.send("The rank id is higher than the maximum rank id.");
        return;
    };

    noblox.setRank(req.params.groupid, req.params.userid, req.params.rankid).catch(function(err){handleErrors(res,err);return;});
    res.send("Success.");
});

app.listen(3000);