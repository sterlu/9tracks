import React, { PureComponent } from 'react';

import './PlaylistPlayer.scss';

class PlaylistPlayer extends PureComponent {
  render() {
    return (
      <div className={'player-wrapper ' + (this.props.id ? 'playing' : '')}>
        {
          this.props.id &&
          <iframe src={`https://open.spotify.com/embed/playlist/${this.props.id}`}
                  width="300" height="80" frameBorder="0" allow="encrypted-media" />
        }
      </div>
    );
  }
}

export default PlaylistPlayer;
