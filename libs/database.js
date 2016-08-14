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
 * @param {string} displayName$password max 20chars each formated password.
 * @returns {object}  DB ready user to add to the DB.
 */
function createNewUser(username, login) {

    return {
        username: username,
        login: login,
        tcg: createRankingBase(),
        ocg: createRankingBase(),
        ocgtcg: createRankingBase(),
        worlds: createRankingBase(),
        goat: createRankingBase() //too soon.

    };
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

function registerNewUser(username, login, callback) {
    var user = createNewUser(username, login);
    db.insert(createNewUser, callback);
}

function updateUserPassword(username, login, password, newpassword, callback) {
    lookup(username + '$' + password, function (error, doc) {
        var newLogin = username + '$' + newpassword,
            update = {
                $set: {
                    login: newLogin
                }
            };
        db.update(login, update, callback);
    });
}

/**
 * Create user object that TrueSkill can work off of.
 * @param   {string} ladder  - tcg/ocg/tcgocg, ranking latter being used.
 * @param   {object} duelist - Duelist object with information on it from the DB.
 * @param   {number} rank - 1 for winner, 2 for loser.
 * @returns {object} object - representing the player that can be used in the trueskill engine.
 */
function prepTrueSkill(ladder, duelist, rank, points) {
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
 * Updates a users trueskill.
 * @param {object} duelist  - TrueSkill user object
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
 * @param {object} duelist  - TrueSkill user object
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
 * @param {object} duelist  - TrueSkill user object
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
 * @param {object} duelist  - TrueSkill user object
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

/**
 * Increaments a duelist won points
 * @param {object}   duelist  [[Description]]
 * @param {function} callback - Callback function.
 */
function applyPoints(duelist, callback) {
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
        update.$set[duelist.ladder].points = doc[0][duelist.ladder].points + duelist.points;
        db.update(query, update, callback);
    });
}

/*var = matchorsingleduel{
    players : ['name', 'name'],
    result : {
        winner : 0,
        method : 2
    },
    ladder : 'tcg',
    rankingSystem : 'trueskill' // can be 'trueskill', 'elo', or 'points'?
}*/
/*var = tagduel{
    players : ['name', 'name', 'name', 'name'],
    result : {
        winner : 0,
        method : 2
    },
    ladder : 'worlds',
    rankingSystem : 'trueskill',
    points : 0
}*/

/**
 * Takes input from YGOSharp duel results and translates it into an object the system can comsume.
 * @param   {object} duel - YGOSharp game result.
 * @returns {object} - object system can comsume.
 */
function translateDuelResult(duel) {
    var duelresult = {
        won: [],
        loss: [],
        rankingSystem: duel.rankingSystem || 'trueskill'
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
            skillEngine.push(prepTrueSkill(duelResult.ladder, duelist, 1, duelResult.points));
        });
        duelistRecords.losers.forEach(function (duelist, sequence) {
            skillEngine.push(prepTrueSkill(duelResult.ladder, duelist, 2, 0));
        });
        trueskill.AdjustPlayers(skillEngine);


        asyncEach(winnerlist, applyWin, function () {
            asyncEach(losserlist, applyLosses, function () {
                asyncEach(drawlist, applyDraws, function () {
                    if (duelResult.rankingSystem === 'trueskill') {
                        asyncEach(skillEngine, updatePlayerTrueSkill, function () {
                            /* Ha Ryuuuukick! ===>*/
                            callback(); // Google "Ryu callback, images"});
                        });
                    } else if (duelResult.rankingSystem === 'point') {}
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

function bind(callback) {
    setInterval(function () {
        getLoginDB(function (loginError, loginDB) {
            if (loginError) {
                callback(loginError);
                return;
            }
            getPublicDB(function (publicError, publicDB) {
                if (publicError) {
                    callback(publicError);
                    return;
                }
                callback(null, {
                    loginDB: loginDB,
                    publicDB: publicDB
                });
            });
        });
    }, 3000);

}

module.exports = {
    bind: bind,
    getPublicDB: getPublicDB,
    getLoginDB: getLoginDB,
    processDuel: processDuel,
    registerNewUser: registerNewUser,
    updateUserPassword: updateUserPassword
};