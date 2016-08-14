## Modules

<dl>
<dt><a href="#module_- Ranking Database">- Ranking Database</a> : <code>object</code></dt>
<dd><ul>
<li>Ranking Database</li>
</ul>
</dd>
<dt><a href="#module_- YGOPro Enumerals">- YGOPro Enumerals</a> : <code>object</code></dt>
<dd><ul>
<li>YGOPro Enumerals</li>
</ul>
</dd>
<dt><a href="#module_- YGOSharp Service Manager">- YGOSharp Service Manager</a> : <code>object</code></dt>
<dd><p>Creates and manages multi process listener for incoming YGOPro Game request, will create masters and slaves of itself.</p>
</dd>
<dt><a href="#module_- YGOPro Network Message Seperator">- YGOPro Network Message Seperator</a> : <code>function</code></dt>
<dd><p>Takes stream of YGOPro network input, slices in individual messages for further processing</p>
</dd>
<dt><a href="#module_- YGOPro Network Message Label">- YGOPro Network Message Label</a> : <code>function</code></dt>
<dd><p>Takes a message frame, labels it.</p>
</dd>
<dt><a href="#module_- YGOSharp Router and Shell">- YGOSharp Router and Shell</a> : <code>function</code></dt>
<dd><p>This is the routing and proxy system. The System checks a number of CTOS commands and from them works out if to just route. the connection to an existing connection or start a new YGOCore. If a new YGOCore is needed it works out what config file is needed for that instance of dueling based on the <code>roompass</code> in the connection string of the <code>CTOS_JOIN</code> command.</p>
</dd>
</dl>

<a name="module_- Ranking Database"></a>

## - Ranking Database : <code>object</code>
- Ranking Database

**Version**: 0.0.1  
**Author:** Jamezs "AccessDenied" L Gladney, August 2016.  
**Example**  
```js
var rankingDB = require('./rankingDB'),    publicDB,    loginDB;    rankingDB.bind(function(error, results){    if (error){        throw error;     }     publicDB = results.publicDB;     loginDB = results.loginDB;});rankingDB.processDuel({    players : ['winner$1234', 'loser$password'],    result : {        winner : 0,        method : 2    },    ladder : 'tcg',    rankingSystem : 'trueskill'}, function(){});
```

* [- Ranking Database](#module_- Ranking Database) : <code>object</code>
    * [~createRankingBase()](#module_- Ranking Database..createRankingBase) ⇒ <code>object</code>
    * [~createNewUser(username, displayName$password)](#module_- Ranking Database..createNewUser) ⇒ <code>object</code>
    * [~lookup(login, callback)](#module_- Ranking Database..lookup)
    * [~registerNewUser(username, login, callback)](#module_- Ranking Database..registerNewUser)
    * [~updateUserPassword(username, login, password, newpassword, callback)](#module_- Ranking Database..updateUserPassword)
    * [~prepTrueSkill(ladder, duelist, rank)](#module_- Ranking Database..prepTrueSkill) ⇒ <code>object</code>
    * [~updatePlayerTrueSkill(duelist, callback)](#module_- Ranking Database..updatePlayerTrueSkill)
    * [~applyWin(duelist, callback)](#module_- Ranking Database..applyWin)
    * [~applyLosses(duelist, callback)](#module_- Ranking Database..applyLosses)
    * [~applyDraws(duelist, callback)](#module_- Ranking Database..applyDraws)
    * [~applyPoints(duelist, callback)](#module_- Ranking Database..applyPoints)
    * [~translateDuelResult(duel)](#module_- Ranking Database..translateDuelResult) ⇒ <code>object</code>
    * [~calculateAndApplyDuelResult(duelResult, callback)](#module_- Ranking Database..calculateAndApplyDuelResult)
    * [~processDuel(duel, callback)](#module_- Ranking Database..processDuel)
    * [~getPublicDB(callback)](#module_- Ranking Database..getPublicDB)
    * [~getLoginDB(callback)](#module_- Ranking Database..getLoginDB)
    * [~massQuery(callback)](#module_- Ranking Database..massQuery)
    * [~bind(callback)](#module_- Ranking Database..bind) ⇒ <code>number</code>
    * [~unbind()](#module_- Ranking Database..unbind)

<a name="module_- Ranking Database..createRankingBase"></a>

### - Ranking Database~createRankingBase() ⇒ <code>object</code>
Create a new ranking table.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  
**Returns**: <code>object</code> - Ranking table.  
<a name="module_- Ranking Database..createNewUser"></a>

### - Ranking Database~createNewUser(username, displayName$password) ⇒ <code>object</code>
Creates a new user

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  
**Returns**: <code>object</code> - DB ready user to add to the DB.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Username |
| displayName$password | <code>string</code> | max 20chars each formated password. |

<a name="module_- Ranking Database..lookup"></a>

### - Ranking Database~lookup(login, callback)
Finds a user in the DB and returns it via callback

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| login | <code>string</code> | username$password string representing how a duelist tells the server thier name. |
| callback | <code>function</code> | Callback function. |

<a name="module_- Ranking Database..registerNewUser"></a>

### - Ranking Database~registerNewUser(username, login, callback)
Registers a new user

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Displayname of user, assumes its username. |
| login | <code>string</code> | username password combo string |
| callback | <code>function</code> | Callback function |

<a name="module_- Ranking Database..updateUserPassword"></a>

### - Ranking Database~updateUserPassword(username, login, password, newpassword, callback)
Update a user password

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | username |
| login | <code>string</code> | old login string. |
| password | <code>string</code> | old password. |
| newpassword | <code>string</code> | password user wishes to change the password to. |
| callback | <code>function</code> | Callback function |

<a name="module_- Ranking Database..prepTrueSkill"></a>

### - Ranking Database~prepTrueSkill(ladder, duelist, rank) ⇒ <code>object</code>
Create user object that TrueSkill can work off of.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  
**Returns**: <code>object</code> - object - representing the player that can be used in the trueskill engine.  

| Param | Type | Description |
| --- | --- | --- |
| ladder | <code>string</code> | tcg/ocg/tcgocg, ranking latter being used. |
| duelist | <code>object</code> | Duelist object with information on it from the DB. |
| rank | <code>number</code> | 1 for winner, 2 for loser. |

<a name="module_- Ranking Database..updatePlayerTrueSkill"></a>

### - Ranking Database~updatePlayerTrueSkill(duelist, callback)
Updates a users trueskill.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="module_- Ranking Database..applyWin"></a>

### - Ranking Database~applyWin(duelist, callback)
increaments a duelist wins

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="module_- Ranking Database..applyLosses"></a>

### - Ranking Database~applyLosses(duelist, callback)
increaments a duelist losses

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="module_- Ranking Database..applyDraws"></a>

### - Ranking Database~applyDraws(duelist, callback)
increaments a duelist draws

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="module_- Ranking Database..applyPoints"></a>

### - Ranking Database~applyPoints(duelist, callback)
Increaments a duelist won points

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | [[Description]] |
| callback | <code>function</code> | Callback function. |

<a name="module_- Ranking Database..translateDuelResult"></a>

### - Ranking Database~translateDuelResult(duel) ⇒ <code>object</code>
Takes input from YGOSharp duel results and translates it into an object the system can comsume.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  
**Returns**: <code>object</code> - - object system can comsume.  

| Param | Type | Description |
| --- | --- | --- |
| duel | <code>object</code> | YGOSharp game result. |

<a name="module_- Ranking Database..calculateAndApplyDuelResult"></a>

### - Ranking Database~calculateAndApplyDuelResult(duelResult, callback)
Takes a duel resul and applies it to the DB. Trueskill only.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duelResult | <code>object</code> | results of the given duel. |
| callback | <code>function</code> | Callback function if you need to do something else after. |

<a name="module_- Ranking Database..processDuel"></a>

### - Ranking Database~processDuel(duel, callback)
Process a YGOSharp duel result.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| duel | <code>object</code> | duel result object. |
| callback | <code>function</code> | callback function. |

<a name="module_- Ranking Database..getPublicDB"></a>

### - Ranking Database~getPublicDB(callback)
Return public rendering of DB.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function |

<a name="module_- Ranking Database..getLoginDB"></a>

### - Ranking Database~getLoginDB(callback)
Return private unfiltered rendering of DB, for login cache.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function |

<a name="module_- Ranking Database..massQuery"></a>

### - Ranking Database~massQuery(callback)
Checks DB returns results to binding function

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function |

<a name="module_- Ranking Database..bind"></a>

### - Ranking Database~bind(callback) ⇒ <code>number</code>
Bind the DB to a cache system, sends it new DB output every 3 seconds.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  
**Returns**: <code>number</code> - the id of the bindfunction setInterval object. Can be used to stop it artifically or for testing.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | function that takes the result. |

<a name="module_- Ranking Database..unbind"></a>

### - Ranking Database~unbind()
Unbind the DB from something.

**Kind**: inner method of <code>[- Ranking Database](#module_- Ranking Database)</code>  
**Retruns**: <code>number\|underfined</code> binding function id.  
<a name="module_- YGOPro Enumerals"></a>

## - YGOPro Enumerals : <code>object</code>
- YGOPro Enumerals

**Version**: 0.0.1  
**Author:** Jamezs "AccessDenied" L Gladney.  
<a name="module_- YGOSharp Service Manager"></a>

## - YGOSharp Service Manager : <code>object</code>
Creates and manages multi process listener for incoming YGOPro Game request, will create masters and slaves of itself.

**Version**: 0.0.1  
**Author:** Jamezs "AccessDenied" L Gladney.  
**Example**  
```js
var gameManager = require('./game-manager.js');
```
<a name="module_- YGOSharp Service Manager..initiateMaster"></a>

### - YGOSharp Service Manager~initiateMaster(numCPUs)
Initiates a number of works.

**Kind**: inner method of <code>[- YGOSharp Service Manager](#module_- YGOSharp Service Manager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| numCPUs | <code>number</code> | number of CPUS the host computer has. |

<a name="module_- YGOPro Network Message Seperator"></a>

## - YGOPro Network Message Seperator : <code>function</code>
Takes stream of YGOPro network input, slices in individual messages for further processing

**Version**: 0.0.1  
**Author:** Jamezs "AccessDenied" L Gladney.  
**Example**  
```js
var framer = new Framemaker();
        socket.on('data', function listener(data) {
            var frame;
            frame = framer.input(data);
            frame.forEach(function(messageFrame){
                //process the frames.
                var task = parsePackets('CTOS', new Buffer(messageFrame));
                processIncomingTrasmission(data, socket, task);
            })
                
            }
            frame = [];
        });
```
<a name="module_- YGOPro Network Message Label"></a>

## - YGOPro Network Message Label : <code>function</code>
Takes a message frame, labels it.

**Version**: 0.0.1  
**Author:** Jamezs "AccessDenied" L Gladney.  
**Example**  
```js
var task = parsePackets('CTOS', new Buffer(messageFrame));
```
<a name="module_- YGOSharp Router and Shell"></a>

## - YGOSharp Router and Shell : <code>function</code>
This is the routing and proxy system. The System checks a number of CTOS commands and from them works out if to just route. the connection to an existing connection or start a new YGOCore. If a new YGOCore is needed it works out what config file is needed for that instance of dueling based on the `roompass` in the connection string of the `CTOS_JOIN` command.

**Version**: 0.0.1  
**Author:** Jamezs "AccessDenied" L Gladney.  
**Example**  
```js
processIncomingTrasmission(data, socket, task);
```

* [- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell) : <code>function</code>
    * [~processTask()](#module_- YGOSharp Router and Shell..processTask)
    * [~connectToCore()](#module_- YGOSharp Router and Shell..connectToCore)
    * [~portfinder()](#module_- YGOSharp Router and Shell..portfinder)
    * [~pickCoreConfig()](#module_- YGOSharp Router and Shell..pickCoreConfig)
    * [~handleCoreMessage()](#module_- YGOSharp Router and Shell..handleCoreMessage)
    * [~legalPassword(passIn)](#module_- YGOSharp Router and Shell..legalPassword) ⇒ <code>boolean</code>
    * [~startCore()](#module_- YGOSharp Router and Shell..startCore)
    * [~processIncomingTrasmission()](#module_- YGOSharp Router and Shell..processIncomingTrasmission)

<a name="module_- YGOSharp Router and Shell..processTask"></a>

### - YGOSharp Router and Shell~processTask()
Listen to the MASTER  process for messages to the SLAVE 
processes. That message will be an update to the internal
gamelist of each SLAVE process

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
<a name="module_- YGOSharp Router and Shell..connectToCore"></a>

### - YGOSharp Router and Shell~connectToCore()
After determining the routing location, then connect the CLIENT to
the proper YGOCore and monitor the connection

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
<a name="module_- YGOSharp Router and Shell..portfinder"></a>

### - YGOSharp Router and Shell~portfinder()
Each YGOCore needs to operate on its own port,
each SLAVE is given a range to loop through. This
is actually a very poor way of doing this and
frequently fails; rewrite is needed

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
<a name="module_- YGOSharp Router and Shell..pickCoreConfig"></a>

### - YGOSharp Router and Shell~pickCoreConfig()
The routing is done based on the
game string or rather `roompass` in
connection request

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
<a name="module_- YGOSharp Router and Shell..handleCoreMessage"></a>

### - YGOSharp Router and Shell~handleCoreMessage()
send the YGOCore API commands back to the main process, some cleanup
is needed before sending the message. Basic logging for finding idiots
later after they have misbehaved or providing administrative ablities
to kill or act on games

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
<a name="module_- YGOSharp Router and Shell..legalPassword"></a>

### - YGOSharp Router and Shell~legalPassword(passIn) ⇒ <code>boolean</code>
Checks if a given password is valid, returns true or false

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
**Returns**: <code>boolean</code> - [[Description]]  

| Param | Type | Description |
| --- | --- | --- |
| passIn | <code>string</code> | [[Description]] |

<a name="module_- YGOSharp Router and Shell..startCore"></a>

### - YGOSharp Router and Shell~startCore()
Unlike DevPro, Salvation does not preload its 
YGOCores. It calls them on demand. This posses a 
few issues but provides routing flexiblity. When a
YGOCore is needed it needs to figure out a few
things. 1.) The configuration file, 2.) a port
number to use and 3.) if it is a valid duel to use
server resources on.

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
<a name="module_- YGOSharp Router and Shell..processIncomingTrasmission"></a>

### - YGOSharp Router and Shell~processIncomingTrasmission()
Call the server and make
sure the user is registered and
not banned. This call is beside
the normal duel request so the
user can connect to a game
possibly before being DC'd
based on connection speeds.
..and VOLIA! Game Request Routing

**Kind**: inner method of <code>[- YGOSharp Router and Shell](#module_- YGOSharp Router and Shell)</code>  
