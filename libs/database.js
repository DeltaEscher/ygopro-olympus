/*jslint node:true*/

var Datastore = require('nedb'),
    db = new Datastore({
        filename: '../database/usersrankings.nedb',
        autoload: true
    });