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

React.render(
  <Index />,
  document.getElementById('container')
);
