import React, { PureComponent } from 'react';

import './PlaylistPlayer.scss';

class PlaylistPlayer extends PureComponent {
  render() {
    const { deezerTracks } = this.props.playlist;
    return (
      <div className={'deezer-player-wrapper ' + (deezerTracks ? 'playing' : '')}>
        {
          deezerTracks &&
          <iframe scrolling="no" frameBorder="0"
                  src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=700&height=350&color=007FEB&layout=dark&size=medium&type=tracks&id=${deezerTracks.join(',')}&app_id=1`} />
        }
      </div>
    );
  }
}

export default PlaylistPlayer;
