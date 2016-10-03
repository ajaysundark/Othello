# Module 2 group project #
__Submitted by:__ _team_name_

__Team members:__

- username@umn.edu
- username@umn.edu
- ...

__Heroku URL:__ _url_

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
current position of the rope (preferably in
[JSON format](https://en.wikipedia.org/wiki/JSON)) and post to `/pull-on-left`
or `/pull-on-right` to affect the state of the game.

> max: I'd like to require JSON, not just suggest it

You will need to have some way of testing and demonstrating your game. This likely
means you will want to build a client. You are free to use whatever tools you
want here as long as they are interacting via your API. I personally would use
[requests or httplib2 in python](http://stackoverflow.com/questions/4476373/simple-url-get-post-function-in-python).

> max: I don't like the wording that they should "build a client".  I understand what you mean, but I think it should be worded more neutrally, like "you will develop a set of tools, scripts, or code that will test and demonstrate the capabilities of your API".

If you just want to poke at your API a little bit you can use tools like
[Advanced REST client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US)
for chrome or [curl](https://curl.haxx.se/docs/manpage.html) on the command line.
Curl has the benefit that it is available on almost all systems.

> max: I haven't used advanced REST client, but I've used the other two.  I use https://www.getpostman.com/ for movielens development, and it's pretty awesome, it does allow you to save your queries to quickly re-run them.  
> max: I don't like recommending a python tool as first choice when this class is so focused on javascript -- node is really good at this, too.  Maybe convert to a less opinionated list, and include node.js as an option?  http://stackoverflow.com/a/5643366/293087
> max: do you think we will be able to evaluate this?  I mean, we might instead choose to require something that we can actually run against their heroku instance to prove that it works.  E.g., this could be a README that simply steps through the basic commands, it could be a set of scripts that contain curl commands, it could be a CLI like the one that I demoed to you.

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

> max: ideas to offer: (a) twitter-like stream of events, (b) scoreboard, (c) live-updating charts.  (I think the existing ideas are ok, but they place the focus on home-built graphics, which are hard and out of scope)


### Stats overview ###
The final requirement is some statistics page for the game. This can be
displaying the number of times a person took a specific action, the amount of
time that it took a game to finish, et cetera. Show any statistics that you
think would be interesting for your specific game.

> max: it's unclear if this is an API endpoint or a web page.  If a web page, is it web sockets or static?

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
  Heroku url for your demo.
- Create a file called `API.md` that documents your api endpoints and how to
  use them.

> max: needs a section on how we will grade the projects
