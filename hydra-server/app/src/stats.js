const Stats = require('stats.js')

module.exports = function() {
  var stats = new Stats();
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  // var statsContainer = document.getElementById('statsJs')
  document.body.appendChild( stats.dom )
  stats.dom.style.cssText="position:absolute;bottom:3em;right:0;cursor:pointer;opacity:0.9;z-index:10000"
  return stats
}

