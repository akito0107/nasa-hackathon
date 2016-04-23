import React from 'react'
import MainFrame from './components/MainFrame'

var Index = React.createClass({
    render: function () {
        return (
            <div>
                <MainFrame url="starsInfo.json"/>
            </div>
        )
    }
});

// set short interval for test 
React.render(
    <Index url="starsInfo.json" pollInterval={5000}/>,
    document.getElementById('container')
);
