const React = require('react');

import PlaylistPlayer from '../PlaylistPlayer/PlaylistPlayer';
import DeezerPlaylistPlayer from '../PlaylistPlayer/DeezerPlaylistPlayer';

import '../App.scss';
import './List.scss';

class List extends React.Component {
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

  playOnDeezer(playlist) {
    this.setState({
      playingWith: 'deezer',
      currentPlaylist: playlist,
    });
  }

  render() {
    const { playlists = [] } = this.props;
    const { currentPlaylist, playingWith } = this.state;

    return (
      <div>
        { playingWith === 'spotify' && <PlaylistPlayer playlist={currentPlaylist} /> }
        { playingWith === 'deezer' && <DeezerPlaylistPlayer playlist={currentPlaylist} /> }
        <div className="playlist-list">
          {
            playlists.map(playlist => (
              <div className="playlist-thumb-wrapper" key={playlist.id}>
                <div className="cover" style={{ backgroundImage: `url(${playlist.cover})` }}>
                  <a onClick={() => this.playPlaylist(playlist)} title="Open in Spotify">▶️ Play using Spotify️</a>
                  {
                    playlist.tracks.deezer &&
                    <a onClick={() => this.playOnDeezer(playlist)} title="Open in Deezer">▶️ Play using Deezer️</a>
                  }
                </div>
                <div className="meta">
                  <h2>
                    {playlist.name}{' '}
                    <a href={`spotify:playlist:${playlist.id}`}
                       onClick={e => e.stopPropagation()} title="Open in Spotify">↗️</a>
                  </h2>
                  <h4>
                    by {playlist.owner.name}
                  </h4>
                  <h5>
                    {playlist.tracks.spotify.total} tracks
                    {playlist.updated &&
                    <span> | updated {(playlist.updated.toISOString ? playlist.updated.toISOString() : playlist.updated).substr(0, 10)}</span>}
                  </h5>
                  <h5>
                    {
                      playlist.tags.map(tag => <span key={tag}>{tag}</span>)
                    }
                  </h5>
                  <h3 dangerouslySetInnerHTML={{ __html: playlist.description }} />
                </div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default List;
