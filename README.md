# Module 2 group project #
__Submitted by:__ [team_name]

__Team members:__

- username@umn.edu
- username@umn.edu
- ...

## Description ##
For this module you will be making a game using Express, WebSockets, and
MongoDB. Your final product will need to have these components:

> max: clarification: "multi-user, online game"?

- A view to watch the game in real time.
- An api that can be used to get information about the current state of the
  the game and post moves to the game.
- A statistics page for the game.

## What constitutes a game? ##
Google says that the definition of "game" is "a form of play or sport" and who
are we to argue with Google. You could do something relatively simple like
[Twitch Plays Tic-tac-toe](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)
to something as complicated as your own
[MUD](https://en.wikipedia.org/wiki/MUD). It doesn't need to be elaborate or
highly visual.

## Watching the game ##
Give me some way to actually see the game play out. If you were doing
tic-tac-toe, I would want to watch as the board fills up. If you were doing
hangman, I would want to see the gallows being built. Fancy graphics aren't
important, just provide some way of conveying action.

> max: should be clear that the expectation is to use socket.io to push events to a UI

> max: doesn't specify the client. are you expecting a single web page?

## API: Playing the game ##
You need to write an api that will let people easily write clients to play your
game. Suppose our game is [tug-of-war](https://en.wikipedia.org/wiki/Tug_of_war).
Then I would want to be able to get `/rope-position` for information about the
current position of the rope (preferably in
[JSON format](https://en.wikipedia.org/wiki/JSON)) and post to `/pull-on-left`
or `/pull-on-right` to effect the state of the game.

> max: seems strange to me that this part is an API, while the other part is not. I advocate for the whole thing to be api so that they learn what it means to build a web api, and to simplify the requirements.  We should provide a skeleton node-based CLI that would send/receive commands and connect to the web socket to do real-time notifications.  Then we could require that they implement CLI commands like `/stats` and `/score` or something.

To test out your api you can use tools like
[Advanced REST client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?hl=en-US)
for chrome. Or you could write your own client using something like
[requests or httplib2 in python](http://stackoverflow.com/questions/4476373/simple-url-get-post-function-in-python).

> max: I would recommend `curl` (since it's on most systems)

## Stats overview ##
The final requirement is some statistics page for the game. This can be
displaying the number of times a person took a specific action, the amount of
time that it took a game to finish, et cetera. Show any statistics that you
think would be interesting for your specific game.
