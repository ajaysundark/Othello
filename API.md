# API endpoints: #
__Submitted by:__ WebCrows

__Team members:__

- nayan003@umn.edu
- tulaj001@umn.edu
- balan016@umn.edu
- rich1044@umn.edu
- karup002@umn.edu

# POST APIs #

- API to post and vdalidate user sign up information to server: curl -H "Content-Type: application/json" -X POST -d '{"username":"test_User_A","password":"test_Pass_A","confirmation":"test_Pass_A"}' http://localhost:2000/signupX

- API to post and validate user login information to server: curl -H "Content-Type: application/json" -X POST -d '{"username":"test_User_X","password":"test_Pass_X"}' http://localhost:2000/loginX

- API to post player moves to server: curl -H "Content-Type: application/json" -X POST -d '{"rows":1,"cols":1, "state": "[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0] ,[0,0,0,1,2,0,0,0], [0,0,0,2,1,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0] ]", "player": 1}' http://localhost:2000/move

# GET APIs #

- API to get game statistics:
curl -i -H "Accept: application/json" http://localhost:2000/statistics

- API to get home page:
curl http://localhost:2000/

- API to get about page:
curl http://localhost:2000/about

- API to get signup page:
curl http://localhost:2000/signup

- API to get gamearea page:
curl http://localhost:2000/gamearea

- API to get spectator page:
curl http://localhost:2000/spectator

- API to get login page:
curl http://localhost:2000/login

- API to get error page:
curl http://localhost:2000/error
