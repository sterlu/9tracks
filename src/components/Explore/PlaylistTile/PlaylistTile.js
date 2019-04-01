import React, { PureComponent } from 'react';
import './PlaylistTile.scss'

class PlaylistTile extends PureComponent {
  render() {
    const { playlist } = this.props;
    return (
      <div className="playlist-tile-wrapper">
        <div className="cover" style={{ backgroundImage: `url(${playlist.cover})` }}>
          <div className="details">
            <p><b>by {playlist.creator} | {playlist.total_tracks} tracks</b></p>
            <p className="description" dangerouslySetInnerHTML={{ __html: playlist.description }} />
            <div className="actions">
              <span></span>
              <a className="play" onClick={() => this.props.play(playlist)} title="Play">▶️</a>
              <a className="open" href={`spotify:playlist:${playlist.id}`} title="Open in Spotify">↗️</a>
            </div>
          </div>
        </div>
        <div className="meta">
          <p className="name">
            {playlist.name}
          </p>
          <div className="tags-wrapper">
            {
              playlist.tags &&
              playlist.tags.map(tag => <span key={tag}>{tag}</span>)
            }
          </div>
        </div>
      </div>
    );
  }
}

export default PlaylistTile;
