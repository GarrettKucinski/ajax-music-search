# ajax-music-search

## Setup

Run
```
npm install
```
in the root of the application

You'll need to register an app with the spotify api and generate a client id and client secret to input into app.js

```
var client_id = 'YOUR_CLIENT_ID'; // Your client id
var client_secret = 'YOUR_CLIENT_SECRET'; // Your secret
```
You will also need to add the url 
```
http:localhost:8888/callback
```
where it says Redirect URIs in the app creation screen, also make sure you save your app at the bottom or it won't work

## Running the App

After you've entered these run 
```
node app.js
```
in the root of the application and navigate your browser to

```
localhost:8888
```
