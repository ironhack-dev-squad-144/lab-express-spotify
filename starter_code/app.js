const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");

// Remember to insert your credentials here
const clientId = "b79b10bd0d1d44d3a5acc36879f307e2";
const clientSecret = "9fe44eb5be014f278d6f5106738865e1";

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body["access_token"]);
  })
  .catch(error => {
    console.log("Something went wrong when retrieving an access token", error);
  });

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:

// the routes go here:
app.get("/", (req, res, next) => {
  res.render("index");
});

app.get("/artists", (req, res, next) => {
  let search = req.query.search;
  console.log("TCL: search", search); // Shorthcut: Ctrl+Alt+L or Cmd+Shift+P > "Turbo"

  spotifyApi
    .searchArtists(search)
    .then(data => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0]
      );
      res.render("artists", {
        search: search,
        artists: data.body.artists.items
      });
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    });
});

app.get("/albums/:artistId", (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId).then(data => {
    // console.log("Artist albums", data.body.items[0]);
    let albums = data.body.items
    spotifyApi.getArtist(req.params.artistId).then(data => {
      console.log(data.body)
      res.render("list-albums", {
        albums: albums,
        artistName: data.body.name
      });
    });
  });
});

app.get("/tracks/:trackId", (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.trackId).then(data => {
    // console.log("Tracks", data.body.items);
    res.render("list-tracks", {
      tracks: data.body.items
    });
  });
});

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
