require("dotenv").config();
const Twitter = require("twitter");
const keys = require('./keys.js')
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);
const request = require("request");
const fs = require("fs")
let liriCommand = process.argv[2];
let subCommandArray = []
let subCommand = ""

// console.log(client);
// console.log(spotify);

switch (liriCommand) {
  case 'my-tweets':
    console.log('\nHere are your 20 latest tweets.\n');
    var params = {
      name: 'phatawkwardlife'
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for (var i = 0; i < tweets.length; i++) {
          console.log((i + 1) + ". " + tweets[i].text + "\n");
        }
      }
    });
    break;
  case 'spotify-this-song':
    let id = '';
    for (var i = 3; i < process.argv.length; i++) {
      JSON.stringify(process.argv[i]);
      subCommandArray.push(process.argv[i]);
      subCommand = subCommandArray.join(' ');
    }
    if (subCommand == '') {
      subCommand = "Ace of Base"
    }
    console.log("\nOkay, here is your song: " + subCommand + "\n");
    spotify.search({
      type: 'track',
      query: subCommand
    }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      } else {
        id = data.tracks.items[0].id;
        spotify
          .request('https://api.spotify.com/v1/tracks/' + id)
          .then(function(data) {
            console.log("Artist: " + data.artists[0].name);
            console.log("Title: " + data.name);
            console.log("Album: " + data.album.name);
            console.log("Spotify Link: " + data.href);
          })
          .catch(function(err) {
            console.error('Error occurred: ' + err);
          });
      }
    });
    break;
  case 'movie-this':
    for (var i = 3; i < process.argv.length; i++) {
      JSON.stringify(process.argv[i]);
      subCommandArray.push(process.argv[i]);
      subCommand = subCommandArray.join('+');
    }
    if (subCommand !=="") {
      console.log("\nOkay, here is your movie: \n");
      var queryUrl = "http://www.omdbapi.com/?t=" + subCommand + "&y=&plot=short&apikey=221f1146";
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("Tile: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("imdb Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        } else {
          console.log(error);
        }
      });
    } else {
      console.log("\nLooks like you didn't choose a movie, here is a recommendation!\n");
      var queryUrl = "http://www.omdbapi.com/?t=Mr.+Nobody&y=&plot=short&apikey=221f1146";
      request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("Tile: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Year);
          console.log("imdb Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Language: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        } else {
          console.log(error);
        }
      });
    }
    break;
  case 'do-what-it-says':
    console.log("\nI have yet to finish this part, a bit overwhelmed this weekend\n");
    fs.readFile("random.txt", "utf8", function(error, data) {
      if (error) {
        return console.log(error);
      }
      console.log(data);
      var dataArr = data.split(",");
      console.log(dataArr);
    });
    break;
  default:
    console.log("I don't quite understand, I'm not as smart as SIRI :(");
    console.log("Your Choices are...\nmy-tweets\nspotify-this-song <song name here>\nmovie-this <movie name here>\ndo-what-it-says");
}
