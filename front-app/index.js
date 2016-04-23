import React from 'react'
import MainFrame from './components/MainFrame'

var Index = React.createClass({
    render: function () {
        return (
            <div>
                <MainFrame url="http://localhost:3000/main"/>
            </div>
        )
    }
});

// set short interval for test 
React.render(
    <Index url="http://localhost:3000/main" pollInterval={5000}/>,
    document.getElementById('container')
);
