## Functions

<dl>
<dt><a href="#createRankingBase">createRankingBase()</a> ⇒ <code>object</code></dt>
<dd><p>Create a new ranking table.</p>
</dd>
<dt><a href="#createNewUser">createNewUser(username, displayName$password)</a> ⇒ <code>object</code></dt>
<dd><p>Creates a new user</p>
</dd>
<dt><a href="#lookup">lookup(login, callback)</a></dt>
<dd><p>Finds a user in the DB and returns it via callback</p>
</dd>
<dt><a href="#registerNewUser">registerNewUser(username, login, callback)</a></dt>
<dd><p>Registers a new user</p>
</dd>
<dt><a href="#updateUserPassword">updateUserPassword(username, login, password, newpassword, callback)</a></dt>
<dd><p>Update a user password</p>
</dd>
<dt><a href="#prepTrueSkill">prepTrueSkill(ladder, duelist, rank)</a> ⇒ <code>object</code></dt>
<dd><p>Create user object that TrueSkill can work off of.</p>
</dd>
<dt><a href="#updatePlayerTrueSkill">updatePlayerTrueSkill(duelist, callback)</a></dt>
<dd><p>Updates a users trueskill.</p>
</dd>
<dt><a href="#applyWin">applyWin(duelist, callback)</a></dt>
<dd><p>increaments a duelist wins</p>
</dd>
<dt><a href="#applyLosses">applyLosses(duelist, callback)</a></dt>
<dd><p>increaments a duelist losses</p>
</dd>
<dt><a href="#applyDraws">applyDraws(duelist, callback)</a></dt>
<dd><p>increaments a duelist draws</p>
</dd>
<dt><a href="#applyPoints">applyPoints(duelist, callback)</a></dt>
<dd><p>Increaments a duelist won points</p>
</dd>
<dt><a href="#translateDuelResult">translateDuelResult(duel)</a> ⇒ <code>object</code></dt>
<dd><p>Takes input from YGOSharp duel results and translates it into an object the system can comsume.</p>
</dd>
<dt><a href="#calculateAndApplyDuelResult">calculateAndApplyDuelResult(duelResult, callback)</a></dt>
<dd><p>Takes a duel resul and applies it to the DB. Trueskill only.</p>
</dd>
<dt><a href="#processDuel">processDuel(duel, callback)</a></dt>
<dd><p>Process a YGOSharp duel result.</p>
</dd>
<dt><a href="#getPublicDB">getPublicDB(callback)</a></dt>
<dd><p>Return public rendering of DB.</p>
</dd>
<dt><a href="#getLoginDB">getLoginDB(callback)</a></dt>
<dd><p>Return private unfiltered rendering of DB, for login cache.</p>
</dd>
<dt><a href="#massQuery">massQuery(callback)</a></dt>
<dd><p>Checks DB returns results to binding function</p>
</dd>
<dt><a href="#bind">bind(callback)</a> ⇒ <code>number</code></dt>
<dd><p>Bind the DB to a cache system, sends it new DB output every 3 seconds.</p>
</dd>
<dt><a href="#unbind">unbind()</a></dt>
<dd><p>Unbind the DB from something.</p>
</dd>
</dl>

<a name="createRankingBase"></a>

## createRankingBase() ⇒ <code>object</code>
Create a new ranking table.

**Kind**: global function  
**Returns**: <code>object</code> - Ranking table.  
<a name="createNewUser"></a>

## createNewUser(username, displayName$password) ⇒ <code>object</code>
Creates a new user

**Kind**: global function  
**Returns**: <code>object</code> - DB ready user to add to the DB.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Username |
| displayName$password | <code>string</code> | max 20chars each formated password. |

<a name="lookup"></a>

## lookup(login, callback)
Finds a user in the DB and returns it via callback

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| login | <code>string</code> | username$password string representing how a duelist tells the server thier name. |
| callback | <code>function</code> | Callback function. |

<a name="registerNewUser"></a>

## registerNewUser(username, login, callback)
Registers a new user

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Displayname of user, assumes its username. |
| login | <code>string</code> | username password combo string |
| callback | <code>function</code> | Callback function |

<a name="updateUserPassword"></a>

## updateUserPassword(username, login, password, newpassword, callback)
Update a user password

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | username |
| login | <code>string</code> | old login string. |
| password | <code>string</code> | old password. |
| newpassword | <code>string</code> | password user wishes to change the password to. |
| callback | <code>function</code> | Callback function |

<a name="prepTrueSkill"></a>

## prepTrueSkill(ladder, duelist, rank) ⇒ <code>object</code>
Create user object that TrueSkill can work off of.

**Kind**: global function  
**Returns**: <code>object</code> - object - representing the player that can be used in the trueskill engine.  

| Param | Type | Description |
| --- | --- | --- |
| ladder | <code>string</code> | tcg/ocg/tcgocg, ranking latter being used. |
| duelist | <code>object</code> | Duelist object with information on it from the DB. |
| rank | <code>number</code> | 1 for winner, 2 for loser. |

<a name="updatePlayerTrueSkill"></a>

## updatePlayerTrueSkill(duelist, callback)
Updates a users trueskill.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="applyWin"></a>

## applyWin(duelist, callback)
increaments a duelist wins

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="applyLosses"></a>

## applyLosses(duelist, callback)
increaments a duelist losses

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="applyDraws"></a>

## applyDraws(duelist, callback)
increaments a duelist draws

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | TrueSkill user object |
| callback | <code>function</code> | Callback function. |

<a name="applyPoints"></a>

## applyPoints(duelist, callback)
Increaments a duelist won points

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duelist | <code>object</code> | [[Description]] |
| callback | <code>function</code> | Callback function. |

<a name="translateDuelResult"></a>

## translateDuelResult(duel) ⇒ <code>object</code>
Takes input from YGOSharp duel results and translates it into an object the system can comsume.

**Kind**: global function  
**Returns**: <code>object</code> - - object system can comsume.  

| Param | Type | Description |
| --- | --- | --- |
| duel | <code>object</code> | YGOSharp game result. |

<a name="calculateAndApplyDuelResult"></a>

## calculateAndApplyDuelResult(duelResult, callback)
Takes a duel resul and applies it to the DB. Trueskill only.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duelResult | <code>object</code> | results of the given duel. |
| callback | <code>function</code> | Callback function if you need to do something else after. |

<a name="processDuel"></a>

## processDuel(duel, callback)
Process a YGOSharp duel result.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| duel | <code>object</code> | duel result object. |
| callback | <code>function</code> | callback function. |

<a name="getPublicDB"></a>

## getPublicDB(callback)
Return public rendering of DB.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function |

<a name="getLoginDB"></a>

## getLoginDB(callback)
Return private unfiltered rendering of DB, for login cache.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function |

<a name="massQuery"></a>

## massQuery(callback)
Checks DB returns results to binding function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Callback function |

<a name="bind"></a>

## bind(callback) ⇒ <code>number</code>
Bind the DB to a cache system, sends it new DB output every 3 seconds.

**Kind**: global function  
**Returns**: <code>number</code> - the id of the bindfunction setInterval object. Can be used to stop it artifically or for testing.  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | function that takes the result. |

<a name="unbind"></a>

## unbind()
Unbind the DB from something.

**Kind**: global function  
**Retruns**: <code>number\|underfined</code> binding function id.  
