import React from 'react'
import Star from './Star'
import Line from './Line'
import GoogleMap from './GoogleMap'
import $ from 'jquery'

export default class MainFrame extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: []
    };
  }

  loadStarsFromServer() {
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

  // TODO: prepare for WebAPI - main
  loadMainFromServer() {
    $.ajax({
      type: 'GET',
      url: this.props.url,
      data: {
        // TODO
        lon: '34.646111111',
        lat: '135.001472222'
      },
      dataType: 'json',
      cache: false,
      success: (data) => { this.setState({data: data}); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  // TODO: prepare for WebAPI - star
  loadStarFromServer() {
    $.ajax({
      type: 'GET',
      url: this.props.url,
      data: {
        // TODO
        id: '100'
      },
      dataType: 'json',
      cache: false,
      success: (data) => { this.setState({data: data}); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  // TODO: prepare for WebAPI - hack
  loadStarFromServer() {
    $.ajax({
      type: 'POST',
      url: this.props.url,
      data: {
        // TODO
        team_id: '1',
        star_id: '100',
        lon: '34.646111111',
        lat: '135.001472222'
      },
      dataType: 'json',
      cache: false,
      success: (data) => { this.setState({data: data}); },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }

  componentDidMount() {
    this.loadStarsFromServer();
    setInterval(this.loadStarsFromServer.bind(this), this.props.pollInterval);
  }

  render() {
    return(
      <div className='MainFrame'>
        <h2>MainFrame</h2>
        <Star data={this.state.data} />
        <Line />
        <GoogleMap />
      </div>
    );
  }
}
