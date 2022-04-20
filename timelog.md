# Timelog

* A multiplayer step-tracking game for phones
* Andy Lopez
* 2334016L
* Matthew Chalmers 

## Guidance

* This file contains the time log for your project. It will be submitted along with your final dissertation.
* **YOU MUST KEEP THIS UP TO DATE AND UNDER VERSION CONTROL.**
* This timelog should be filled out honestly, regularly (daily) and accurately. It is for *your* benefit.
* Follow the structure provided, grouping time by weeks.  Quantise time to the half hour.

## Week 1 (20.09.2021 – 26.09.2021)
•	Project bidding 
•	Research prospective projects

## Week 2 (27.09.2021 – 03.10.2021)
•	Arrange initial meeting with supervisor
•	Research pass the ball & last years project 
•	Look at existing health apps- pros and cons
•	Brainstorm fitness app ideas and game concepts (Minecraft, zombie run…) 
•	Initial UI sketch
•	Game Idea

## Week 3 (04.10.21 – 10.10.21)
•	Get feedback for the app idea and game concept 
•	Research different frameworks to develop mobile applications
•	Research how to collect physical data- GPS, accelerometer, APIs, android sensors 
•	Figma wireframes- gamified wireframe & health focused wireframe
•	Use iterative design process 
•	Identify requirements 

## Week 4 (11.10.21 – 17.10.21) (iteration 1)
•	Start of iteration 1. 
•	Research specialized health apps
•	Read fish ‘n’ steps paper 
•	Chose framework - react native and use android studio as IDE
•	Start implementing design – paper sketches of screens
•	Find resources on react native 
•	Start learning- Udemy course on react native 
•	Research different backends to use with react native
•	Research how to send data to/from backend
•	Sketch simple architecture diagram and data flow diagram 

## Week 5 (18.10.21 – 24.10.21)
•	AWS- send data to server and back
•	Set up environment in react native 
•	Basic layout of mobile application in react native
•	Identify features I want in the application 
•	Dissertation focus- the effect of the pandemic on physical activity and mental health
•	Continue researching with a focus on:
    o	the impact COVID-19 has had on young adults- physically and mentally
    o	Focus on target age group between 16-25 (youth)
    o	how consistent exercise can benefit mental health wellbeing
•	Refined game concept, project goal and main features of game
    Add feature that encourages overall well-being. Users can challenge their team mates to perform health tasks to unlock achievements
•	Identify what features users wanted/monitored in the mobile app in survey
•	Sent out initial survey to stakeholders: game concept, gather data on physical/mental health data

## Week 6  (25.10.21 – 31.10.21) (iteration 2)
•	End of iteration 1: 
o	got familiar with fitness trackers, started learning app development with react native
•	Start of iteration 2. 
o	continue learning framework, learn about AWS backend and sending data
•	Review and analyse survey data 
•	Research- identify if there is a link between mental health and COVID-19 from the survey 
•	Continue getting familiar with developing app in react native 
•	Continue researching for dissertation
•	Ethical concern- revised target age group from 16-25, to 18+ 

## Week 7 (1.11.21– 7.11.21)
•	N/A family emergency
## Week 8 (8.11.21- 14.11.21) 
•	N/A family emergency
•	End of iteration 2: 
o	Not much progress- shift to iteration 3 

## Week 9 (15.11.21- 21.11.21) (iteration 3)
•	Start of iteration 3 
o	continue learning react native, chose how to get step count,  learn about AWS backend and sending data
•	Continue using react native and following Udemy react native course
•	Changed backend from AWS to Firebase 
•	Start Udemy course for react native & Firebase 
•	Research step counter react native libraries 


## Week 10  (22.11.21 – 28.11.21)  
•	Google services- google maps API, google fit API
•	Chose Google fit API for step counter
•	End of iteration 3:
o	Went with react native & firebase for backend to send data to and from app, chose to use google fit API for the step counter 

## Week 11 (29.11.21 – 05.12.21) (iteration 4)
•	Start of iteration 4
o	implement simple step counter with google API, have 4 basic screens, implement register/login screen, start working on team joining functionality 
•	bottom tab navigator- navigates between 4 blank screens 
•	implement first screen to login/register with 

## Week 12 (06.12.21 – 12.12.21) 
•	Android app permissions for google fit API
## Week 13 (13.12.21 – 19.12.21) 
•	Submit and email Status Report 
•	End of iteration 4:
o	1 screen with login/register- firebase authentication  
o	4 basic screens- user page, leader board/map page, map page, challenge page 
o	Bottom tab navigator 
o	background research to investigate how success of fitness application and effect on mental wellbeing has been performed in the research literature

## Winter Break
## Week 1 (10.01.22 – 16.01.22) (iteration 1)
Decide how user will join a team, implement feature, decide what to include on prototype 
•	Google fit API: Issue with authorisation, permissions, got empty step data
•	Consider how a user will join a team 
User joins a team using a code 
join a random team, create a team, join by inputting a team code
•	Refined what to include in prototype 
Login/registration page, join team page, user’s activity overview 
Only include key elements 
Refine simple screen views 
Users will gain points by walking

## Week 2 (17.01.22- 23.01.22) 
•	restructure project- get rid of Expo 
•	add top bar
•	add join a team page
•	stack screen
•	Create a team collection  in Firebase
•	Start implementing the logic on how a user will join a team in backend
•	Display team members in user activity page
•	End of iteration 1: 
Decide how users join a team, started join a team feature, add join a team screen, login/register screen

## Week 3 (24.01.22 – 30.01.22) (iteration 2)
Fix issues with google fit, get step count data, send to backend
Finish join a team page 
Finish user activity page showing step count
Add map screen- display users progressing through map 
Send user data to user collection in Firebase 
•	create logo for app
•	graph library – react native chart kit
•	Add graph to activity screen to display data 
•	Decide how players will challenge another team member: 
A user will try to get the highest step count in an hour
They then select a team member to challenge 
If they accept they can choose when their workout starts 
Whoever has the highest step count from their workout wins
Generate first test APK to test step counter

## Week 4  (31.01.22 – 06.02.22) 
**Monday** 
•	make graph dynamic with step data 
•	display user steps for current day
•	Experience points from the step count 
•	Error when trying to run app on phone 
**Wednesday** 
•	Map Screen UI
•	Join a team logic issue
•	data from activity screen will be used in other screen (leader board page, challenge page, team screen page)
•	Send/save the data from activity screen to Firestore for other pages to use
**Friday**
•	Meeting
•	work on showing progress in map stepper
•	put users name next to label
•	get daily steps and user name 
•	issue: username shows next to all positions
**Saturday/Sunday**
•	Added username to join a team screen
•	Display error to user when:
o	create team: if username or team code empty show error 
o	join random, join team: if username empty show error
•	Fixed issue with join a team 
•	Sign out button to activity page
•	Icons to bottom navigator
•	Send user data from activity page (weekly steps, points, daily steps, username) to Firestore in user collection
o	Update then send to Firestore 
o	This will be used for the map screen to show position of a user in stepper
•	UI of map screen:
o	Use RN stepper indicator for map progression
•	Need to render the labels of the stepper dynamically: 
o	Function to check user position in stepper:
0k: user steps:  < 1000
1k user steps: >=1000 <2000
2k user steps: >=2000 < 3000
3k user steps: >=3000 < 4000
4k user steps: >= 4000 < 5000
5k user steps: >= 5000
•	Show 4 user’s name according to their daily step count on the step indicator
•	new APK with all the fixes for me to test
•	End of iteration 2:
o	Got step count
o	Finished join a team page
o	finished activity page
o	added map page progression feature

## Week 5 (7.02.22 – 13.02.22) (iteration 3)
o	add team activity page to display other players data, order it according to step count 
o	add challenge screen and allow players to challenge other players
o	minimum viable product evaluation: instead of participants testing first prototype themselves, conduct live demo over zoom of the app and getting feedback from 3 participants
•	Find a team screen: when creating team, if it already exists show error message saying it exists
•	bug on find a team page: alert user that a team already exists
•	make a username unique through the whole game so it’s a unique identifier 
•	alert user that team and/or a username already exists
•	on home page put username in a bubble like UI design
•	format team activity page
•	get team activity data for team members from firebase and show on screen

## Week 6 (14.02.2022 – 20.02.2022) 
**Tuesday**
•	Get weekly steps for team activity page from challenge page: 
o	When user accepts challenge, does challenge, save and send steps to backend, navigates to challenge screen
o	Get the steps from challenge and append to the array of weekly steps
o	Difficult: adding loads of single steps to a large array 
o	Check if step elements are being added to array and being put into the weekly step value in activity page
o	To do: once it works, get the past 7 day steps only so its actually from the last 7 days (weekly) and not just every steps 
•	Fixed bug when user logs back in they are no longer prompted to join a team again
**Wednesday** 
•	Steps updated when user completes challenge in timer screen in firebase 
o	Add steps to get today steps
o	Add steps to get weekly steps
•	Removed challenge requests when accepted/declined in back & front end- only cleans up when you navigate to a different page
•	Fixed steps being overwritten when challenge accepted
•	Sort team members in team activity page so player with most points is first
**Thursday**
•	demo
•	user demonstration feedback:
o	more features to add competitive side of game- 2 players must battle against each other (not just challenge 1 player)
o	add images and colour
o	unclear about the story behind the game
o	doesn’t feel like a game- add more competition 
o	1 page to login and register is not common
**Friday** 
•	User background timer package for timer screen so it clock ran in the background
•	Added use screen at the top navigation bar (front end only)
o	user image upload from file or camera
o	user can update username
•	tomorrow: update image and username to backend, show images throughout app, fix when clicked from user page to user screen and back the user page still appears, get total steps for last 7 days (weekly steps) right now it doesn’t
**Saturday**
o	Bug in team activity & home screen- displays more than 4 people on the team. (challenge screen ok)
o	Team Activity Screen
o	Display user in order of who has the highest points 
o	Added user profile screen 
o	User can add profile picture 
o	Update username 
o	Challenge page 
o	Added timer package that runs in the background 
o	Added steps to today steps and weekly steps 
o	Removed request that were declined/accepted 
o	Display text telling user has no requests
**Sunday**
•	Settings screen functionality completed
o	Gathered suggestions/feedback:
o	Issue: common problem app kept crashing when trying to register for mostly everyone after downloading APK 
o	End of iteration 3:
o	evaluation - demo minimum viable product to stakeholders
o	Fixed issues on join a team page
o	designed team activity page and order them accord to step count
o	send challenge data to Firebase
o	let user upload a profile picture and update name
o	implement challenge page- allow users to decline/accept page
o	make timer countdown page for challenge
o	User evaluation of prototype & survey 

## Week 7 (21.02.2022 – 27.02.2022) (iteration 4)
•	Fix graph- new graph package
•	Add log functionality 
•	Find participants to test first prototype and get feedback from questionnaire 
•	Add colour/images to mobile application
**Monday** 
•	People downloaded APK: 
o	It kept crashing- fix
o	Cut off in graph 
•	Map screen
o	Team must reach a collaborative goal
o	Check when the day changes 
o	If team loses- delete the team in collection, update the user collection team ID to null, delete username from team, navigate to join a team
**Tuesday**
•	Map screen
o	If team wins- notify them 
o	Bug with undefined data- check first if steps are null if so display zero else do other stuff
o	Background task react native package- usually implemented in backend but firebase is serverless. Instead use function that checks what date it is against date from firebase and then calls function to delete the team when team lost. 
•	Bug found: profile image doesn’t display correctly in team activity and settings page 
•	Test if delete team works: 
**Wednesday** 
•	Bugs- kept crashing when trying to register- errors not being handled, just being console logged
•	App separate register and login page
**Thursday**
•	Analytics stuff started- tracking test if it shows tomorrow (usually takes 24 hours)
•	Updated username in backend and leader board screen 
**Friday**
•	Analytics for all the data I want: Activity.js, Leaderboard.js, Team activity.js
•	Profile.js
o	update User
o	sign out 
o	get image from library 
o	get image from camera
•	Challenge.js
o	Request challenge 
o	Accept challenge
o	decline challenge
**Saturday/Sunday**
•	1 day trial of first prototype
•	Create post-survey to gather feedback on the prototype 
•	Issues: application kept crashing when trying to register/login 

## Week 8 (28.0.2022 – 06.03.2022) 
**Monday**  
•	Analyse feedback 
•	implement features- add images, add colour, add page to see history of challenges (won/lost/tied), look at adding characters, add way to invite friends, screen freeze (need screen loader)
•	fix issues with crashing login/register screen, past challenge screen 
**Tuesday**
•	react native share package- let users invite friends to their team through socials
•	need both users to complete challenge not just 1 person to show if won/lost (game unlike before)
•	past challenges- once challenge accepted data deleted- need persistent challenge data, store date/challenger/accepted by/challenger steps/ accepted steps, after timer over send data to backend from person
**Wednesday** 
•	firebase analytics
•	create custom events- error
o	followed documentation but error 
o	got event but events wont show up in firebase, firebase known issue
•	 past challenge screen- add challenges sent by you section nav to timer screen
**Thursday** 
•	fix- challenge page crashes as there’s no past challenges 
•	add past challenges to backend & add past challenge screen
•	get challenge data for challenger and challenged – if user rejects challenge, challenge wont show up in challenge even though user will complete challenge. Boolean- accepted/declined
o	steps >= 0 show challenge
o	steps == 0 don’t show (user declined challenge)
•	past challenges: tie/win/loose
•	user sends challenge- they do challenge, other user accepts challenge
•	memory leak? 
•	User interface fix- don’t use full black
**Friday** 
•	add Lottie package
o	image for timer page
o	fire spinner for loading modal
•	font- config file
•	add spinner so reflects that button is getting/sending data from backend 
•	Meeting- email Matthew beforehand to view draft, ask for extension
Review of iteration 4:
o	Design- added colour, added profile picture to map (from survey feedback)
o	Change graph from bar to line (from survey feedback)
o	Send analytic data to google analytics 
o	Add spinner to improve UX (from survey feedback)

## Week 9 (07.03.2022 – 13.03.2022) (iteration 5):
o	design study guide, information sheet for final user evaluation
o	custom font
o	splash screen
o	add custom modals in app
o	add survival log modal to show days survived everyday
**Monday** 
•	added line graph instead of bar graph- better to visualize 
•	UI
o	bottom tab bar- turn white when on screen, inactive red
o	top tab bar
o	change to colour scheme
•	add default image to profile 
**Tuesday**
•	use step data & date for graph axis
•	add custom font  
•	activity page steps- get steps added to challenge from backend instead of firebase 
•	finish timer page
**Wednesday** 
•	google fit error & team challenge error
o	get rid of google fit, add another screen like timer screen , people commented that they didn’t have space for google fit anyway
o	don’t get rid of google fit- challenge steps wont be added to google steps 
•	can’t change google fit steps- only access, didn’t notice because it was commented out to test other functionalities & didn’t test on actual phone with challenge page only on debug mode with emulator 
•	timer screen- make scrollable
**Thursday**
•	fix- when entering random room lets you join in with more than 4 people
•	survival map- make image dynamic for different screen sizes
**Friday**
•	study guide- add supervisor, specify data gathered 
•	graph- update steps automatically from firebase 
**Saturday/Sunday**
•	added user timer screen
•	added modals- past challenge & camera
•	got rid of google fit API
•	past challenges- add ongoing to use case, change screen name to challenge details

## Week 10 (14.03.2022 – 20.03.2022) 
**Tuesday**  
•	Analyse quality of step counters- from google API, actual steps, accurate step counter, modified accurate step counter
•	Design evaluation- collect 3 types of data: 
o	sus- generic usability of the app
o	(user experience of app): interviews ask how user found the app (compare this with log data to see validity), questionnaire. Get more specific data/feedback on the major functions 
o	Console data- actual data, how often user on screen, log data, how much user actually used functions 
**Thursday**
•	Reset daily total after each day
•	Analytics data- chose between different analytic package Forage or segment 
•	Send data with both segment and forage to see which works 
•	Implement icon for the app
•	Splash screen – boot splash package 
**Friday** 
•	Fix- user timer should stop and send data if challenge timer is started 
•	Modal for survival log- show modal everyday 
**Saturday **
•	Reset team total daily
•	Analytic tool- forage
•	Show “times up” modal in challenge screen when times up- send steps to firebase, navigate user to challenge screen 
**Sunday** 
•	Intro slides & Lottie animations 
•	Review of iteration 6:
o	Issue: challenge steps are not being added to google fit steps- created user timer page to manually track steps 
o	Issue: cant get custom events on Google analytics- try other analytic tools
o	Splash screen
o	Added some modals
o	application icon

## Week 11 (21.03.2022 – 27.03.2022) (iteration 6)
o	use remainder of 2 weeks to for could have requirements – distance and google maps feature 
o	final user evaluation 
•	Add map feature with google map API  
•	Get distance user travelled 

## Week 12 (28.03.2022 – 03.04.2022) 
•	Change colour theme of google maps 
•	Fix survival log- if user logs in check if team total reached- if yes update survived days by 1, no- remove team from collection. Show corresponding modals for both
•	Check ethics check list 
•	Find participants and send study guide
•	Conduct Interviews 
•	Fix structure of dissertation 

## Week 13 (4.4.22 – 10.4.22)
•	ethics form
•	Submit dissertation 
•	Upload project to GitHub repo 
•	Presentation & demo video 
•	Deadline 30.04.2022 at 17:00
