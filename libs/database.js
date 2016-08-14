/*jslint node:true*/
'use strict';
var asyncEach = require('async-each'),
    Datastore = require('nedb'),
    trueskill = require('trueskill'),
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
        trueskill: [25.0, 25.0 / 3.0],
        points: 0,
        winLossMethods: []
    };
}

function createNewUser(username) {

    return {
        username: username,
        login: '',
        tcg: createRankingBase(),
        ocg: createRankingBase(),
        ocgtcg: createRankingBase(),
        worlds: createRankingBase(),
        goat: createRankingBase()

    };
}

function prepTrueSkill(ladder, duelist, rank) {
    var output = {
        skill: [],
        rank: rank
    };
    output.skill = duelist[ladder].trueskill;
    return output;
}



function lookup(login, callback) {
    db.find({
        login: login
    }, callback);
}

function update(duelist, callback) {


}

//var duelresult = {
//        won :['playername'],
//        loss : ['playername']
//    }
function processDuel(duelResult, ladder, callback) {
    var duelistRecords = {
        winners: [],
        losers: []
    };

    function applySkill() {
        var skillEngine = [];
        duelistRecords.winners.forEach(function (duelist, sequence) {
            skillEngine.push(prepTrueSkill(ladder, duelist, 1));
        });
        duelistRecords.losers.forEach(function (duelist, sequence) {
            skillEngine.push(prepTrueSkill(ladder, duelist, 2));
        });
        trueskill.AdjustPlayers(skillEngine);
        asyncEach(skillEngine, update, function () {
            callback();
        });

    }

    asyncEach(duelResult.won, lookup, function (error, contents) {
        if (error) {
            console.error(error);
        }
        duelistRecords.winners = contents;
        asyncEach(duelResult.loss, lookup, function (error, contents) {
            if (error) {
                console.error(error);
            }
            duelistRecords.losers = contents;
            applySkill();
        });
    });
}