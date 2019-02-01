// At the top of the liri.js file, add code to read and set any environment variables with the dotenv package:

require("dotenv").config();

// To retrieve the data that will power this app, you'll need to send requests using the axios package to the Bands in Town, Spotify and OMDB APIs. You'll find these Node packages crucial for your assignment.

// Node-Spotify-API **differnt var from require key
var Spotify = require("node-spotify-api");
// Axios (You'll use Axios to grab data from the OMDB API and the Bands In Town API)
var axios = require("axios");
// Moment
var moment = require("moment");
// DotEnv (moved above)

// Require fs to read/create/update/delete/rename files
var fs = require("fs");

// Add the code required to import the keys.js file and store it in a variable.

var keys = require("./keys.js");

// You should then be able to access your keys information like so

var spotify = new Spotify(keys.spotify);

// Make it so liri.js can take in one of the following commands:

// concert-this
// spotify-this-song
// movie-this
// do-what-it-says
let command = process.argv[2];
let input = process.argv[3];

// concert-this <artist/band name here>


//    * This will search the Bands in Town Artist Events API (`"https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"`) for an artist and render the following information about each event to the terminal:
function concertThis() {
  if (typeof input === "undefined") {
    console.log("Please enter an artist after the command.");
    return;
  }
  axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp")
    .then(function (response) {
      // console.log(response.data);
      // console.log(response.data[0]);
      if (response.data[0] != undefined) {
        console.log("--------------------------------------------------------------------");
        //  * Name of the venue
        console.log(`Name of Venue:  ${response.data[0].venue.name}`);
        //  * Venue location
        console.log(`Venue Location:  ${response.data[0].venue.city}`);
        //  * Date of the Event (use moment to format this as "MM/DD/YYYY")
        console.log(`Date of Event:  ${moment(response.data[0].datetime).format("MM/DD/YYYY")}`);
        console.log("--------------------------------------------------------------------");
      } else {
        console.log("There are no events for this artist. Please try again with a different artist.")
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

//spotify-this-song '<song name here>'

//    * You will utilize the [node-spotify-api](https://www.npmjs.com/package/node-spotify-api) package in order to retrieve song information from the Spotify API.

//    * The Spotify API requires you sign up as a developer to generate the necessary credentials. You can follow these steps in order to generate a **client id** and **client secret**:

//    * Step One: Visit <https://developer.spotify.com/my-applications/#!/>

//    * Step Two: Either login to your existing Spotify account or create a new one (a free account is fine) and log in.

//    * Step Three: Once logged in, navigate to <https://developer.spotify.com/my-applications/#!/applications/create> to register a new application to be used with the Spotify API. You can fill in whatever you'd like for these fields. When finished, click the "complete" button.

//    * Step Four: On the next screen, scroll down to where you see your client id and client secret. Copy these values down somewhere, you'll need them to use the Spotify API and the [node-spotify-api package](https://www.npmjs.com/package/node-spotify-api).

//    * This will show the following information about the song in your terminal/bash window

function spotifyThis() {
  if (typeof input === "undefined") {
    //    * If no song is provided then your program will default to "The Sign" by Ace of Base.
    input = "The Sign, Ace of Base";
  }
  spotify.search({ type: 'track', query: input, limit: 1 }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    console.log("--------------------------------------------------------------------");
    //      * Artist(s)
    console.log(`Artist(s): ${data.tracks.items[0].artists[0].name}`);
    //      * The song's name
    console.log(`Song name: ${data.tracks.items[0].name}`);
    //      * A preview link of the song from Spotify
    console.log(`Preview link: ${data.tracks.items[0].preview_url}`);
    //      * The album that the song is from
    console.log(`Album: ${data.tracks.items[0].album.name}`);
    console.log("--------------------------------------------------------------------");
  });

}
//movie-this '<movie name here>'

//    * This will output the following information to your terminal/bash window:

//      ```
function movieThis(input) {
  if (typeof input === "undefined") {
    //    * If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    input = "Mr Nobody";
    // console.log(input);
  }
  //    * You'll use the `axios` package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use `trilogy`.
  axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=full&tomatoes=true&apikey=trilogy")
    .then(function (response) {
      console.log("--------------------------------------------------------------------");
      //        * Title of the movie.
      console.log("Title: " + response.data.Title);
      //        * Year the movie came out.
      console.log("Year: " + response.data.Year);
      //        * IMDB Rating of the movie.
      console.log("IMDB Rating: " + response.data.imdbRating);
      //        * Rotten Tomatoes Rating of the movie.
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      //        * Country where the movie was produced.
      console.log("Country Produced: " + response.data.Country);
      //        * Language of the movie.
      console.log("Language: " + response.data.Language);
      //        * Plot of the movie.
      console.log("Plot: " + response.data.Plot);
      //        * Actors in the movie.
      console.log("Actors: " + response.data.Actors);
      console.log("--------------------------------------------------------------------");
      // console.log(response2.data.Ratings);
      //      ```
    }
    );
};
// do-what-it-says`

function doWhatItSays() {
  //    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
  //      * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.
  //      * Edit the text in random.txt to test out the feature for movie-this and concert-this.
  fs.readFile('random.txt', "utf8", function (err, data) {
    let dataArray = data.split(",");
    command = dataArray[0];
    input = dataArray[1];
    spotifyThis(input);
  });
}

switch (command) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    console.log("Please use one of the following commands: concert-this, spotify-this-song, movie-this, do-what-it-says");
};
