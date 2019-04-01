import gql from 'graphql-tag';

export const queryPlaylists = gql`
  query Playlists($offset: Int, $count: Int, $tag: String) {
    playlists(offset: $offset, count: $count, tag: $tag) {
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
