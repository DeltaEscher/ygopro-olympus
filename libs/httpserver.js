/*jslint node : true*/
'use strict';
var express = require('express'),

    path = require("path"),
    toobusy = require('toobusy-js'),
    app = express(),
    vhost = require('vhost'),
    serveIndex = require('serve-index');

function createVirtualStaticHost(domainName, dirPath) {
    return vhost(domainName, express['static'](dirPath));
}



app.use(createVirtualStaticHost('localhost', require('path').resolve(process.cwd() + '\\..\\http')));
app.use(createVirtualStaticHost(process.env.ProductionSITE, require('path').resolve(process.cwd() + '\\..\\http')));

app.use(function (req, res, next) {
    if (toobusy()) {
        res.send(503, "I'm busy right now, sorry.");
    } else {
        next();
    }
});

app.listen(80);

require('fs').watch(__filename, process.exit);