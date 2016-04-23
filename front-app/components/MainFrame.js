import React from 'react'
import Star from './Star'
import Line from './Line'
import $ from 'jquery'

export default class MainFrame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (data) => { this.setState({data: data}); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  render() {
    return(
      <div className='MainFrame'>
        <h2>MainFrame</h2>
        <Star data={this.state.data} />
        <Line />
      </div>
    );
  }
}
