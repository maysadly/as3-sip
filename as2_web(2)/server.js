require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
const PORT = 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

spotifyApi.clientCredentialsGrant().then(
  (data) => spotifyApi.setAccessToken(data.body['access_token']),
  (err) => console.error('Error retrieving access token', err)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.post('/search', (req, res) => {
  const searchQuery = req.body.query;
  spotifyApi.searchTracks(searchQuery).then(
    (data) => {
      const results = data.body.tracks.items.map((track) => ({
        name: track.name,
        artists: track.artists.map((artist) => artist.name).join(', '),
        album: track.album.name,
        link: track.external_urls.spotify,
        image: track.album.images[0]?.url,
        releaseDate: track.album.release_date,
        duration: track.duration_ms,
      }));
      res.json(results);
    },
    (err) => res.status(500).send('Error fetching data from Spotify')
  );
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
