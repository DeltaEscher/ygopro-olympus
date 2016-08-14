/*jslint node : true*/
'use strict';
var express = require('express'),
    path = require("path"),
    toobusy = require('toobusy-js'),
    app = express(),
    vhost = require('vhost'),
    serveIndex = require('serve-index'),
    site = process.env.ProductionSITE || 'ygorankings.ml';

function createVirtualStaticHost(domainName, dirPath) {
    return vhost(domainName, express['static'](dirPath));
}

app.use(createVirtualStaticHost('localhost', require('path').resolve(process.cwd() + '\\..\\http')));
app.use(createVirtualStaticHost(site, require('path').resolve(process.cwd() + '\\..\\http')));

app.use(function (req, res, next) {
    if (toobusy()) {
        res.send(503, "I'm busy right now, sorry.");
    } else {
        next();
    }
});

app.post('/register', function (req, res) {
    res.send('POST request for register');
});

app.post('/updatelogin', function (req, res) {
    res.send('Post request for update login');
});

app.get('/ladder', function (req, res) {
    res.send('GET request for ladder JSON');
});

app.listen(80);

require('fs').watch(__filename, process.exit);