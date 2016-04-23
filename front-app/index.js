import React from 'react'
import MainFrame from './components/MainFrame'
import Menu from './components/Menu'

var Index = React.createClass({
  render:function(){
    return (
      <div>
        <MainFrame url="starsInfo.json" />
        <Menu />
      </div>
    )
  }
});

// set short interval for test 
React.render(
  <Index url="starsInfo.json" pollInterval={5000} />,
  document.getElementById('container')
);
