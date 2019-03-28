import gql from 'graphql-tag';

export const queryPlaylists = gql`
  query Playlists($offset: Int, $count: Int) {
    playlists(offset: $offset, count: $count) {
      id
      name
      description
      created
      updated
      cover
      creator
      tags
      total_tracks
    }
  }
`;
