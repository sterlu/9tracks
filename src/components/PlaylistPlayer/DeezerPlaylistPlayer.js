import React, { PureComponent } from 'react';

import './PlaylistPlayer.scss';

class PlaylistPlayer extends PureComponent {
  render() {
    const { deezer } = this.props.playlist.tracks;
    return (
      <div className={'deezer-player-wrapper ' + (deezer ? 'playing' : '')}>
        {
          deezer &&
          <iframe scrolling="no" frameBorder="0"
                  src={`https://www.deezer.com/plugins/player?format=classic&autoplay=false&playlist=true&width=700&height=350&color=007FEB&layout=dark&size=medium&type=tracks&id=${deezer.items.join(',')}&app_id=1`} />
        }
      </div>
    );
  }
}

export default PlaylistPlayer;
