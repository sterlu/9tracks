const React = require('react');
const { renderToString } = require('react-dom/server');

module.exports = (Component, props) =>
  renderToString(React.createElement(Component, props, null));
