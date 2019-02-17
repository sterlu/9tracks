const React = require('react');

import PlaylistPlayer from '../PlaylistPlayer/PlaylistPlayer';

import '../App.scss';
import './List.scss';

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: ''
    };

    this.playPlaylist = this.playPlaylist.bind(this);
  }

  playPlaylist(id) {
    this.setState({ id });
  }

  render() {
    const { playlists = [] } = this.props;
    const { id } = this.state;

    return (
      <div>
        <PlaylistPlayer id={id} />
        <div className="playlist-list">
          {
            playlists.map(playlist => (
              <a className="playlist-thumb-wrapper" key={playlist.id}
                 onClick={() => this.playPlaylist(playlist.id)}>
                <div className="cover"
                     style={{ backgroundImage: `url(${playlist.images.length && playlist.images[0].url})` }} />
                <div className="meta">
                  <h2>{playlist.name}</h2>
                  <h4>by {playlist.owner.display_name}</h4>
                  <h5>
                    {
                      playlist.tags.map(tag => <span>{tag}</span>)
                    }
                  </h5>
                  <h3 dangerouslySetInnerHTML={{ __html: playlist.description }} />
                </div>
              </a>
            ))
          }
        </div>
      </div>
    );
  }
}

export default List;
