/*jslint node:true*/
'use strict';
var asyncEach = require('async-each'),
    Datastore = require('nedb'),
    trueskill = require('trueskill'),
    db = new Datastore({
        filename: '../database/usersrankings.nedb',
        autoload: true
    });

/**
 * Create a new ranking table.
 * @returns {object} Ranking table.
 */
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

/**
 * Creates a new user
 * @param   {string} username Username
 * @returns {object}  DB ready user to add to the DB.
 */
function createNewUser(username) {

    return {
        username: username,
        login: '',
        tcg: createRankingBase(),
        ocg: createRankingBase(),
        ocgtcg: createRankingBase(),
        worlds: createRankingBase(),
        goat: createRankingBase() //too soon.

    };
}

/**
 * [[Description]]
 * @param   {string} ladder  - tcg/ocg/tcgocg, ranking latter being used.
 * @param   {object} duelist - Duelist object with information on it from the DB.
 * @param   {number} rank - 1 for winner, 2 for loser.
 * @returns {object} object - representing the player that can be used in the trueskill engine.
 */
function prepTrueSkill(ladder, duelist, rank) {
    var output = {
        skill: [],
        rank: rank,
        ladder: ladder,
        login: duelist.login
    };
    output.skill = duelist[ladder].trueskill;
    return output;
}


/**
 * Finds a user in the DB and returns it via callback
 * @param {string} login - username$password string representing how a duelist tells the server thier name.
 * @param {function} callback - Callback function.
 */
function lookup(login, callback) {
    db.find({
        login: login
    }, callback);
}

/**
 * Updates a users trueskill.
 * @param {object}   duelist  [[Description]]
 * @param {function} callback - Callback function.
 */
function updatePlayerTrueSkill(duelist, callback) {
    var query = {
            login: duelist.login
        },
        update = {
            $set: {}
        };
    update.$set[duelist.ladder].trueskill = duelist.skill;
    db.update(query, update, callback);
}

/**
 * increaments a duelist wins
 * @param {object}   duelist  [[Description]]
 * @param {function} callback - Callback function.
 */
function applyWin(duelist, callback) {
    lookup(duelist.login, function (error, doc) {
        if (error) {
            throw error;
        }
        var query = {
                login: duelist.login
            },
            update = {
                $set: {}
            };
        update.$set[duelist.ladder].win = doc[0][duelist.ladder].win + 1;
        db.update(query, update, callback);
    });
}

/**
 * increaments a duelist losses
 * @param {object}   duelist  [[Description]]
 * @param {function} callback - Callback function.
 */
function applyLosses(duelist, callback) {
    lookup(duelist.login, function (error, doc) {
        if (error) {
            throw error;
        }
        var query = {
                login: duelist.login
            },
            update = {
                $set: {}
            };
        update.$set[duelist.ladder].losses = doc[0][duelist.ladder].losses + 1;
        db.update(query, update, callback);
    });
}

/**
 * increaments a duelist draws
 * @param {object}   duelist  [[Description]]
 * @param {function} callback - Callback function.
 */
function applyDraws(duelist, callback) {
    lookup(duelist.login, function (error, doc) {
        if (error) {
            throw error;
        }
        var query = {
                login: duelist.login
            },
            update = {
                $set: {}
            };
        update.$set[duelist.ladder].draws = doc[0][duelist.ladder].draws + 1;
        db.update(query, update, callback);
    });
}

/*var = matchorsingleduel{
    players : ['name', 'name'],
    result : {
        winner : 0,
        method : 2
    },
    ladder : 'tcg'
}*/
/*var = tagduel{
    players : ['name', 'name', 'name', 'name'],
    result : {
        winner : 0,
        method : 2
    },
    ladder : 'worlds'
}*/

/**
 * Takes input from YGOSharp duel results and translates it into an object the system can comsume.
 * @param   {object} duel - YGOSharp game result.
 * @returns {object} - object system can comsume.
 */
function translateDuelResult(duel) {
    var duelresult = {
        won: [],
        loss: []
    };

    if (duel.players.length === 2) {
        if (duel.winner === 0) {
            duelresult.won.push(duel.players[0]);
            duelresult.loss.push(duel.players[1]);
        } else {
            duelresult.won.push(duel.players[1]);
            duelresult.loss.push(duel.players[0]);
        }
    } else if (duel.players.length === 4) {
        if (duel.winner === 0) {
            duelresult.won.push(duel.players[0]);
            duelresult.won.push(duel.players[1]);
            duelresult.loss.push(duel.players[2]);
            duelresult.loss.push(duel.players[3]);
        } else {
            duelresult.won.push(duel.players[2]);
            duelresult.won.push(duel.players[3]);
            duelresult.loss.push(duel.players[0]);
            duelresult.loss.push(duel.players[1]);
        }
    }
    duelresult.ladder = duel.ladder;
    return duelresult;
}

/**
 * Takes a duel resul and applies it to the DB. Trueskill only.
 * @param {object}   duelResult - results of the given duel.
 * @param {function} callback - Callback function if you need to do something else after.
 */
function calculateAndApplyDuelResult(duelResult, callback) {
    var duelistRecords = {
        winners: [],
        losers: []
    };

    function applySkill() {
        var skillEngine = [],
            winnerlist = [],
            losserlist = [],
            drawlist = [];

        duelistRecords.winners.forEach(function (duelist, sequence) {
            skillEngine.push(prepTrueSkill(duelResult.ladder, duelist, 1));
        });
        duelistRecords.losers.forEach(function (duelist, sequence) {
            skillEngine.push(prepTrueSkill(duelResult.ladder, duelist, 2));
        });
        trueskill.AdjustPlayers(skillEngine);

        asyncEach(skillEngine, updatePlayerTrueSkill, function () {
            asyncEach(winnerlist, applyWin, function () {
                asyncEach(losserlist, applyLosses, function () {
                    asyncEach(drawlist, applyDraws, function () {
                        /* Ha Ryuuuukick! ===>*/
                        callback(); // Google "Ryu callback, images"
                    });
                });
            });
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

function processDuel(duel, callback) {
    calculateAndApplyDuelResult(translateDuelResult(duel), callback);
}

function getPublicDB(callback) {
    db.find({}, function (error, docs) {
        var result = [];
        if (error) {
            callback(error);
        }
        docs.forEach(function (user) {
            delete user.login;
            result.push(user);
        });
        callback(null, result);
    });
}

function getLoginDB(callback) {
    db.find({}, function (error, docs) {
        var result = [];
        if (error) {
            callback(error);
        }
        callback(null, result);
    });
}

module.exports = {
    getPublicDB: getPublicDB,
    getLoginDB: getLoginDB,
    processDuel: processDuel
};