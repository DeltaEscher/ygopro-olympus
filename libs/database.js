/*jslint node:true*/
'use strict';
var Datastore = require('nedb'),
    db = new Datastore({
        filename: '../database/usersrankings.nedb',
        autoload: true
    });


function createRankingBase() {
    return {
        wins: 0,
        loses: 0,
        draws: 0,
        elo: 1200,
        trueskill: 1200,
        points: 0
    };
}

function createNewUser(username) {

    return {
        username: username,
        login: '',
        tcg: createRankingBase(),
        ocg: createRankingBase(),
        traditional: createRankingBase(),
        worlds: createRankingBase(),
        anime: createRankingBase(),
        highlander: createRankingBase(),
        goat: createRankingBase()

    };
}