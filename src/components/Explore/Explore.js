const React = require('react');
import ApolloClient from 'apollo-boost';
import { ApolloProvider, Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import PlaylistPlayer from '../PlaylistPlayer/PlaylistPlayer';
import { queryPlaylists } from '../../queries/playlists';
import PlaylistTile from './PlaylistTile/PlaylistTile';
import './Explore.scss';

const client = new ApolloClient({
  uri: '/graphql'
});

class Explore extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playingWith: '',
      currentPlaylist: {},
    };

    this.playPlaylist = this.playPlaylist.bind(this);
  }

  playPlaylist(playlist) {
    this.setState({
      playingWith: 'spotify',
      currentPlaylist: playlist,
    });
  }

  render() {
    const { currentPlaylist, playingWith } = this.state;
    const tagFilter = this.props.match.params.tag;

    return (
      <ApolloProvider client={client}>
        <div className="explore-wrapper">
          {playingWith === 'spotify' && <PlaylistPlayer playlist={currentPlaylist} />}

          <h2>
            Recent
            {
              tagFilter &&
              <span className="tag-filter-notification">
                tagged with {tagFilter} <Link to="/" title="Clear">Clear</Link>
              </span>
            }
          </h2>

          <Query
            query={queryPlaylists}
            notifyOnNetworkStatusChange={true}
            variables={{
              offset: 0,
              count: 15,
              tag: tagFilter
            }}
          >
            {({ loading, error, data, fetchMore }) => {
              return <div>
                <div className="playlist-grid">
                  {
                    data && data.playlists &&
                    data.playlists.map(playlist => (
                      <PlaylistTile key={playlist.id} playlist={playlist}
                                    play={this.playPlaylist} />
                    ))
                  }
                </div>
                {
                  !loading &&
                  <a className="fetch-more" onClick={() => fetchMore({
                    variables: { offset: data.playlists.length, count: 20, },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      if (!fetchMoreResult) return prev;
                      return Object.assign({}, prev, {
                        playlists: [...prev.playlists, ...fetchMoreResult.playlists]
                      });
                    }
                  })}>more...</a>
                }
                {loading && <p className="loading">Loading...</p>}
                {error && <p>{error.toString()}</p>}
              </div>;
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default Explore;
