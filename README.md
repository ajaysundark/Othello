# Module 2 group project #
__Submitted by:__ WebCrows

__Team members:__

- nayan003@umn.edu
- tulaj001@umn.edu
- balan016@umn.edu
- rich1044@umn.edu
- karup002@umn.edu

__Heroku URL:__

https://wcothello.herokuapp.com/

__Argument of ambition:__


Being a two player game, Othello is played in alternate turns where one player must make a valid move to affect the state of the game. Following points make the project technically ambitious:

- Algorithm to implement Othello rule engine is complex.
- Two players have to be given an exclusive board on which they play.
- Each play involves validating multiple rules e.g. if the right player is making the move, if the move is valid.
- The state of board is not changed unless all the rules pass validation.
- Maintaining live scores and then towards the end of the game declaring the winner based on who has the highest number of coins on the board.

__Argument of execution:__

- We thought of impelmenting the Othello rule engine using recursion and we were successful in doing this.
- We were able to provide an exclusive board for two players. We created a game object using sockets.
- We were able to implement the turn logic successfully which is essential to a turn based game.
- The client and server processing is independent of each other.
- Clients post move to the server using post APIs.
- Leaderboard page uses get API to get statistics.
- Signup and login features have been implemented using APIs.
- A spectator mode has been provided where the spectators can watch the game in real time. We made use of sockets to implement spectator mode.
- MongoDB has been used to store statistics and user information.

## Description ##
For this module you will be making a multi-user, online game using Express,
WebSockets, and MongoDB. Your final product will need to have these components:

- An API that can be used to get information about the current state of the
  the game and post moves to the game. This will be how the game can be played.
- A view to watch the game in real time.
- A statistics page for the game.

### What constitutes a game? ###
Google says that the definition of "game" is "a form of play or sport" and who
are we to argue with Google. You could do something relatively simple like
[Twitch Plays Tic-tac-toe](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)
to something as complicated as your own
[MUD](https://en.wikipedia.org/wiki/MUD). It doesn't need to be elaborate or
highly visual.

### API: Playing the game ###
You need to write an web API that will let people easily write clients to play your
game. Suppose our game is [tug-of-war](https://en.wikipedia.org/wiki/Tug_of_war).
Then I would want to be able to get `/rope-position` for information about the
current position of the rope in
[JSON format](https://en.wikipedia.org/wiki/JSON) and post to `/pull-on-left`
or `/pull-on-right` to affect the state of the game.

You will need to develop a set of tools, scripts, or code that will test and
demonstrate the capabilities of your API. You can use whatever languages you
want to accomplish this. Both
[node.js](http://stackoverflow.com/questions/5643321/how-to-make-remote-rest-call-inside-node-js-any-curl/5643366#5643366)
and
[python](http://stackoverflow.com/questions/4476373/simple-url-get-post-function-in-python)
are capable of this. There is a good chance your favorite language can do it
also.

If you just want to poke at your API a little bit you can use tools like
[Postman](https://www.getpostman.com/) and
[Advanced REST client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US)
as in browser options or
[curl](https://curl.haxx.se/docs/manpage.html) on the command line.
Curl has the benefit that it is available on almost all systems.

### Watching the game ###
Create a view for spectators. Your players will be interacting via your API,
but you should also have a way for spectators to watch via a webpage. This
should update in real time, so you will need to use WebSockets to push
events out to the UI.

What you display here is up to your own judgment, just make sure it is
something worth watching. If you were doing tic-tac-toe, I would want to watch
as the board fills up. If you were doing hangman, I would want to see the
gallows being built. You don't need fancy graphics, just provide some way of
conveying action.

Other potential options:

- twitter-like stream of events
- scoreboard
- live-updating charts


### Stats overview ###
The final requirement is some statistics web page for the game. This can be
displaying the number of times a person took a specific action, the amount of
time that it took a game to finish, et cetera. Show any statistics that you
think would be interesting for your specific game. You can make this static or
use web sockets to update content live here.

## Setting up your database ##
Someone from each group should create an account with [mLab](https://mlab.com/)
and setup a free sandbox database. This will be the database you should use for
your project. __If you want to connect from inside the UMN you should send us
the URI they gave you.__ We will then send you back a URI you can use to
connect.

### The reasoning (in case you want to know) ###
The reason you need to do this is that the UMN network blocks certain outgoing
ports. These are also the ports that mLab uses to let you connect. We have a
server outside of UMN that listens on ports that are not blocked and will
forward your traffic on to mLab.

## Submission ##
- Your code should be pushed up to your repo on github
- Fill this `README.md` out with your team name, team members' emails, and
  Heroku url for your demo. Additionally, complete the argument sections at the
  top of the file.
- Create a file called `API.md` that documents your api endpoints and how to
  use them. These should include a valid `curl` command and a description of its
  expected output.

## Grading ##
You will be graded on the __ambition__ and __execution__ of the project. At
the top of this `README.md` you have the opportunity to argue why your
submission was ambitious and well executed. In order for us to grade it, you
must have it hosted on Heroku. To earn an "A" grade, a project must be
technically ambitious, well-executed, and polished. To earn a passing grade, a
project must minimally fulfill the three requirements listed in the description.
