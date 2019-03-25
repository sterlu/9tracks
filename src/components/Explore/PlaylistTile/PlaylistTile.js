import React, { PureComponent } from 'react';
import './PlaylistTile.scss'

class PlaylistTile extends PureComponent {
  render() {
    const { playlist } = this.props;
    return (
      <div className="playlist-tile-wrapper">
        <div className="cover" style={{ backgroundImage: `url(${playlist.cover})` }}>
          <div className="details">
            <p><b>by {playlist.owner.name}</b></p>
            <p><b>{playlist.tracks.spotify.total} tracks</b></p>
            {
              playlist.updated &&
              <p><b>updated {new Date(parseInt(playlist.updated)).toISOString().substr(0, 10)}</b></p>
            }
            <p className="description" dangerouslySetInnerHTML={{ __html: playlist.description }} />
            <div className="actions">
              <a onClick={() => this.props.play(playlist)} title="Play">▶️ Play</a>
              <br />
              <a href={`spotify:playlist:${playlist.id}`} title="Open in Spotify">↗️ Open</a>
            </div>
          </div>
        </div>
        <div className="meta">
          <p className="name">
            {playlist.name}
          </p>
          <div className="tags-wrapper">
            {
              playlist.tags.map(tag => <span key={tag}>{tag}</span>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PlaylistTile;
