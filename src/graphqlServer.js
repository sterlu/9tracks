const { ApolloServer } = require('apollo-server-express');

const storage = require('./utils/storage');

const typeDefs = [`
  type Query {
    playlist(id: String): Playlist
    playlists(count: Int, offset: Int): [Playlist]
  }

  type Playlist {
    id: String
    name: String
    description: String
    created: String
    updated: String
    cover: String
    images: [Image]
    owner: SpotifyUser
    source: String
    spotifyId: String
    tags: [String]
    tracks: PlaylistTracks
  }
  
  type PlaylistTracks {
    spotify: SpotifyTracklist
  }
  
  type SpotifyUser {
    name: String
    id: String
  }
  
  type SpotifyTracklist {
    total: Int
    items: [Track]
  }
  
  type Image {
    height: Int
    width: Int
    url: String
  }
  
  type Track {
    name: String
    artist: String
    artists: [Artist]
    album: String
  }
  
  type Artist {
    id: String
    name: String
  }

  schema {
    query: Query
  }
`];

const pl = {
  '_id': '5c766452efad4ce42bb73d69',
  'id': '1XO7EaJQJHbxzXlJawWGW3',
  'name': 'Lista en vivo by SongLytics',
  'description': '',
  'created': '2019-01-08T19:34:17.000Z',
  'updated': '2019-01-13T00:30:50.000Z',
  'cover': 'https://mosaic.scdn.co/640/5b645ebac79e770da342d755bc34d24e9794c3f177eb7c17cafe55037d5eb4bc24af76b3daf5c64087136278f7553d1150e1a7199d62bee438c04fe1f0ac2738d8dc60c1e20664b10073222739dadf75',
  'images': [],
  'owner': {
    'name': 'Miguel David',
    'id': '31fr2fuoiyn67aieniifzktlzenm'
  },
  'source': 'spotify',
  'spotifyId': '1XO7EaJQJHbxzXlJawWGW3',
  'tags': [
    'February competition - Crosstown'
  ],
  'tracks': {
    'spotify': {
      'total': 20,
      'items': []
    }
  },
};
const track = {
  'name': 'Lo Se Mi Amor',
  'artist': 'Eduardo D',
  'artists': [],
  'album': 'Cosas De Amor'
};
const image = {
  'height': 640,
  'url': 'https://mosaic.scdn.co/640/5b645ebac79e770da342d755bc34d24e9794c3f177eb7c17cafe55037d5eb4bc24af76b3daf5c64087136278f7553d1150e1a7199d62bee438c04fe1f0ac2738d8dc60c1e20664b10073222739dadf75',
  'width': 640
};
const artist = {
  'external_urls': {
    'spotify': 'https://open.spotify.com/artist/7fBIKj5U9s2EstFAFvoFw6'
  },
  'href': 'https://api.spotify.com/v1/artists/7fBIKj5U9s2EstFAFvoFw6',
  'id': '7fBIKj5U9s2EstFAFvoFw6',
  'name': 'Eduardo D',
  'type': 'artist',
  'uri': 'spotify:artist:7fBIKj5U9s2EstFAFvoFw6'
};

const resolvers = {
  Query: {
    playlists: async (root, { count, offset }) => {
      console.log(offset, count)
      return (await storage.getPlaylists(count, offset));
    },
    playlist: async (root, { _id }) => {
      return (await storage.getPlaylist(id));
    },
  },
};

module.exports = (app, path) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  server.applyMiddleware({ app, path });
};
