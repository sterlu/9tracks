import React, { PureComponent } from 'react';
import './Header.scss';

class Header extends PureComponent {
  render() {
    return (
      <div className="header">
        <h1 className="logo">9tracks</h1>
      </div>
    );
  }
}

export default Header;
