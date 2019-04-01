const { ApolloServer } = require('apollo-server-express');

const storage = require('./utils/storage');

const typeDefs = [`
  type Query {
    playlist(id: String): Playlist
    playlists(count: Int, offset: Int, tag: String): [Playlist]
  }

  type Playlist {
    id: String
    name: String
    description: String
    created: String
    updated: String
    cover: String
    images: [Image]
    creator: String
    source: String
    tags: [String]
    tracks: [String]
    total_tracks: Int
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

const resolvers = {
  Query: {
    playlists: async (root, { count, offset, tag }) => {
      return (await storage.getPlaylists(count, offset, tag));
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
