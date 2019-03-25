import React, { PureComponent } from 'react';

import './PlaylistPlayer.scss';

class PlaylistPlayer extends PureComponent {
  render() {
    const { id } = this.props.playlist;
    return (
      <div className={'spotify-player-wrapper ' + (id ? 'playing' : '')}>
        {
          id &&
          <iframe src={`https://open.spotify.com/embed/playlist/${id}`} frameBorder="0" allow="encrypted-media" />
        }
      </div>
    );
  }
}

export default PlaylistPlayer;
