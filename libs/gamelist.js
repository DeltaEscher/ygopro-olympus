/*jslint  node: true, plusplus: true, white: false, nomen  : true*/
// Gamelist object acts similar to a Redis server, could be replaced with on but its the gamelist state.
'use strict';
var http = require('http'),
    fs = require('fs');



var express = require('express'),
    path = require("path"),
    toobusy = require('toobusy-js'),
    app = express(),
    vhost = require('vhost'),
    serveIndex = require('serve-index'),
    site = process.env.ProductionSITE || 'ygorankings.ml',
    rankingDB = require('./database.js');

var primus,
    gamelist = {},
    registry = {},

    booting = true,
    Primus = require('primus'),
    Rooms = require('primus-rooms'),
    primusServer = http.createServer().listen(24555),
    domain = require('domain'),
    path = require('path'),
    ps = require('ps-node');

setTimeout(function () {
    //give the system five seconds to figure itself out.
    booting = false;
}, 5000);


//
function makePlayer(skill, rank) {
    return {
        skill: skill,
        rank: rank
    };
}

function internalMessage(announcement) {
    process.nextTick(function () {
        primus.room('internalservers').write(announcement);
    });
}

function logger(announcement) {
    internalMessage({
        messagetype: 'log',
        log: announcement
    });
}

function handleCoreMessage(core_message_raw, port, pid, game) {

    var chat,
        join_slot,
        leave_slot,
        lock_slot,
        core_message,
        handleCoreMessageWatcher = domain.create();
    handleCoreMessageWatcher.on('error', function (error) {
        console.log('[Gamelist]:Error-CoreMessage', core_message_raw, error);
    });
    handleCoreMessageWatcher.enter();

    if (core_message_raw.toString().indexOf("::::") < 0) {
        return gamelist; //means its not a message pertaining to the gamelist API.
    }

    core_message = core_message_raw.toString().split('|');
    //console.log(core_message, core_message_raw);
    core_message[0] = core_message[0].trim();
    if (core_message[0] === '::::network-ready') {
        return;
    }
    if (gamelist[game] === undefined) {
        gamelist[game] = {
            players: [],
            locked: [false, false, false, false],
            spectators: 0,
            started: false,
            time: new Date().getTime(),
            pid: pid || undefined
        };
        //if the room its talking about isnt on the gamelist, put it on the gamelist.
    }

    switch (core_message[0]) {
    case ('::::network-end'):
        //console.log('--');
        break;
    case ('::::join-slot'):
        join_slot = parseInt(core_message[1], 10);
        if (join_slot === -1) {
            return;
        }
        gamelist[game].players[join_slot] = core_message[2].trim();
        gamelist[game].time = new Date().getTime();
        gamelist[game].port = port;
        break;

    case ('::::left-slot'):
        leave_slot = parseInt(core_message[1], 10);
        if (leave_slot === -1) {
            return;
        }
        gamelist[game].players.splice(leave_slot, 1);
        cleanGamelist();
        break;

    case ('::::spectator'):
        gamelist[game].spectators = parseInt(core_message[1], 10);
        break;

    case ('::::lock-slot'):
        lock_slot = parseInt(core_message[1], 10);
        gamelist[game].locked[lock_slot] = Boolean(core_message[1]);
        break;
    case ('::::end-duel'):
        console.log('[Results]', core_message, game);
        cleanGamelist();
        break;
    case ('::::endduel'):
        //ps.kill(gamelist[game].pid, function (error) {});
        delete gamelist[game];
        cleanGamelist();
        //process.kill(pid);
        break;
    case ('::::end-game'):
        //ps.kill(gamelist[game].pid, function (error) {});
        delete gamelist[game];
        cleanGamelist();
        //process.kill(pid);
        break;
    case ('::::chat'):
        chat = core_message.join(' ');
        process.nextTick(function () {
            logger(pid + '|' + core_message[1] + ': ' + core_message[2]);
        });
        process.nextTick(function () {
            //duelserv.bot.say('#public', gamelist[game].pid + '|' + core_message[2] + ': ' + core_message[3]);
        });
        break;
    case ('::::start-game'):
        gamelist[game].started = true;
        gamelist[game].time = new Date().getTime();
        //duelserv.bot.say('#public', gamelist[game].pid + '|Duel starting|' + JSON.stringify(gamelist[game].players));
        //console.log('real start-game', game);
        internalMessage({
            record: true,
            port: port,
            roompass: game
        });
        break;


    default:
        console.log('unknown command', game, core_message, core_message[1].length);
    }
    handleCoreMessageWatcher.exit();
}

function announce(announcement) {
    primus.room('activegames').write(announcement);
}


function messageListener(message) {

    var messageListenerWatcher = domain.create();
    messageListenerWatcher.on('error', function (err) {
        if (err) {
            console.log(err);
        }
    });
    messageListenerWatcher.run(function () {
        var brokenup = message.core_message_raw.toString().split('\r\n'),
            game,
            users,
            i = 0;
        for (i; brokenup.length > i; i++) {
            handleCoreMessage(brokenup[i], message.port, message.pid, message.game);
        }
        announce(JSON.stringify(gamelist));
    });
    return gamelist;
}


function cleanGamelist() {
    var game,
        update = false;
    for (game in gamelist) {
        if (gamelist.hasOwnProperty(game)) {
            if (gamelist[game].players.length === 0 && gamelist[game].spectators === 0) {
                //delete if no one is using the game.
                //del(gamelist[game].pid);
                delete gamelist[game];
                update = true;
            }
        }
    }
    for (game in gamelist) {
        if (gamelist.hasOwnProperty(game)) {
            if (gamelist[game] && game.length !== 24) {
                //delete if some wierd game makes it into the list somehow. Unlikely.
                delete gamelist[game];
                update = true;
            }
        }
    }
    for (game in gamelist) {
        if (gamelist.hasOwnProperty(game)) {
            if (new Date().getTime() - gamelist[game].time > 2700000) {
                //delete if the game is older than 45mins.
                delete gamelist[game];
                update = true;
            }
        }
    }
    if (update) {
        announce(JSON.stringify(gamelist));
    }

}


function sendRegistry() {
    internalMessage({
        messagetype: 'registry',
        registry: registry
    });
}

function sendGamelist() {
    internalMessage({
        messagetype: 'gamelist',
        gamelist: gamelist
    });
}



primus = new Primus(primusServer, {
    parser: 'JSON'
});
primus.plugin('rooms', Rooms);


primus.on('error', function (error) {
    console.log('[Gamelist]:', error);
});

function onData(data, socket) {
    var socketwatcher = domain.create(),
        action,
        save;
    socketwatcher.on('error', function (err) {
        if (err.message === "TypeError: Cannot read property 'forwarded' of undefined") {
            // not sure how to handle this yet.
            return;
        }
        console.log('[Gamelist]Error-Critical:', err);
    });
    socketwatcher.enter();
    data = data || {};
    action = data.action;
    save = false;
    if (socket.readyState !== primus.Spark.CLOSED) {
        save = true;
    }
    if (save === false) {
        return;
    }

    socket.join(socket.address.ip + data.uniqueID);
    switch (action) {
    case ('internalServerLogin'):
        if (data.password !== process.env.OPERPASS) {
            return;
        }
        socket.join('internalservers');
        if (booting && data.gamelist && data.registry) {
            gamelist = data.gamelist;
            registry = data.registry;
            booting = false;
            //console.log('[Gamelist]:', data.gamelist, data.registry);
        }
        break;

    case ('gamelistEvent'):

        if (data.password === process.env.OPERPASS) {
            messageListener(data.coreMessage);
            sendGamelist();
        } else {
            console.log('bad insternal request');
        }
        break;
    case ('join'):
        socket.join(socket.address.ip + data.uniqueID);
        socket.write({
            clientEvent: 'registrationRequest'
        });


        socket.join('activegames');
        socket.write(JSON.stringify(gamelist));

        break;
    case ('leave'):
        socket.leave('activegames');
        break;
    case ('internalRestart'):
        if (data.password !== process.env.OPERPASS) {
            return;
        }
        //restartAnnouncement();
        break;
    case ('restart'):
        //restartCall(data);
        break;
    case ('privateServerRequest'):
        primus.room(socket.address.ip + data.uniqueID).write({
            clientEvent: 'privateServerRequest',
            parameter: data.parameter,
            local: data.local
        });
        break;
    default:
        console.log(data);
    }
    socketwatcher.exit();
}

primus.on('connection', function (socket) {
    var connectionwatcher = domain.create();
    connectionwatcher.on('error', function (err) {
        console.log('[Gamelist]Error Critical User-Connection:', err);
    });
    connectionwatcher.enter();
    socket.on('error', function (error) {
        console.log('[Gamelist]:Generic Socket Error:', error);
    });
    socket.on('data', function (data) {
        var save = false;
        if (socket.readyState !== primus.Spark.CLOSED) {
            save = true;
        }
        if (save === false) {
            return;
        }
        onData(data, socket);
    });
    connectionwatcher.exit();
});
require('fs').watch(__filename, process.exit);



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


rankingDB.bind(function (error, result) {

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