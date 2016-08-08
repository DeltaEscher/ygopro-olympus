#To do list

##Server functionality

###Runs only on Linux, best compatibility is Ubuntu from current setup

Emanuel, Mercury, AccessDenied, and CreaturePhil (and anyone else who can help) need to go through Mercury’s code via voice chat. 

[Mercury's NodeJS Ygopro Server](https://github.com/mercury233/ygopro-server)

* Handle Memory Leaks in Mercury’s NodeJS server

* Re-analyze the NodeJS server code and optimize for better stability and performance

* Emulate/Sandbox instances of server for error handling, debugging, and reducing overhead

* Manage queues to increase capacity of server instances

* Implement [TrueSkill](https://github.com/freethenation/node-trueskill) Ranking system that calculates a user’s ranking and puts them on the correct room with their opponent.


*TrueSkill works the same as Elo in terms of matchmaking. Players get paired with a player who is on queue with a similar Trueskill rating. -* **Antimetaman**

**If the queue is based on a threshold or does the queue include everyone?** (Asked by Bromantic) 
*The way to do this is to separate players in queue rooms by their rating. For example, Room 1 contains 100 people with rating from 1000-1500, Room 2 contains 100 people with rating 1501-2000, etc. -* (**Answered by Antimetaman**)

*If a Room overflows, then a new Room should be created to move players with the upper bound of that rating to that room. For example, there are 200 players in with rating of 1000-1500. Hence, take the top 100 players of that room and create a new Room. This may make Room 1 now hold 100 players with 1000-1200 and Room 2 with 1201 to 1500, further dividing the Rooms by smaller intervals of rating. -* (**Answered by Antimetaman**)

* Create a secure MySQL login system to handle user’s ranking records
* [Create website to show these rankings.](http://ygoprorankings.ml) (**Work in progress.**) Emanuel said he can help with the website. I have another website designer who will also help. If you need the login for ygoprorankings.ml, *ask Aire or cloud9p on the Discord chat.*

* Unify the game and the server under one language - preferably [nodeJS](https://nodejs.org/en/)

##Ranking Formats
* Include TCG with TCG Banlist, OCG with OCG Banlist, TCG/OCG with World’s Banlist for Singles/Matches and Tags.
* Add TCG rulings
* Create a subfolder in the scripts or expansions for each region. Currently, this is **TCG** and **OCG** [Script separate cards for TCG and OCG based on their regional rulings.]  (http://www.yugioh-card.com/en/gameplay/rulings_errata.html)
* Put scripts in the allocated folder.
* Rulings will be automatically determined via banlist. _**TCG** will be the default._ Cards rulings will be scripted instead of editing the core.
* Game mechanics that can't be managed by card scripts will be managed by the proper core or configuaration.

###Conifgured [SEGOC] (http://yugioh.wikia.com/wiki/Simultaneous_Effects_Go_On_Chain) for each Banlist
Auto chain order settings are configured according to the chosen banlist. Auto chain order is OFF for OCG and Worlds banlists. It is ON for TCG banlist. 

>Auto Chain Order ON works if you: 

>Tribute Sangan for Zaborg. Both of these are TP Mandatory. Sangan was tributed first so it met its activation condition BEFORE Zaborg and hence it would activate earlier. 

>Auto Chain Order ON does not work if you: 
Activate Dark Hole to destroy Dante, Traveler of the Burning Abyss with Cir, Malebranche of the Burning Abyss as Xyz Material. Both Dante and Cir are TP Optional and their activation conditions met at the same time. Hence the Player should be able to select the chain order even if Auto Chain order ON but they cannot currently.

[Explained by YGorganization](https://ygorganization.com/learnrulingspart3/)

For uniformity and consistency, the client will not have any unofficial formats. This includes Newgioh, Anime, and Custom cards. For the time being, those who wish for such will need to host their own server. Otherwise, they can port-forward or use a free [VPN service if they cannot port-forward](https://en.wikipedia.org/wiki/Virtual_private_network).


### Ranking Tags

#### Not a current focus, but listed below are the guidelines for Tag Dueling. 

[Offically sanctioned Tag Rules](http://www.yugioh-card.com/en/league/dueling/tag_dueling.html )


###Ranking meta

We can automatically record the number of times a card is used in a deck and divide by the total of players to get the frequency percentage of that card. Then multiply that percentage by the Trueskill rating of the player that used it. For example, the top 10 players used Burning Abyss and all of them had Phantom Knights Fog Blade, so Phantom Knights Fog Blade would get a high rank.

#How the server works

1. Listen on server
2. User successfully connects to server
3. Create a room
4. Run instance of YGOPro
5. Print a port
6. Connect YGOPro
7. Relay messages between YGOPRO server and the user
8. Add a new user to created room

**[Mercury233]:** *It will read the messages YGOPRO client to server (CTOS), forward it to the YGOPRO server, and the messages server to client (STOC), forward it to the client.*


#DB
| Username      | Level         | Wins  | Loses | Draws |
| ------------- |:-------------:|:-----:|:-----:|:-----:|
| Player        | 1250          |     30| 5     | 0
