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
        <div class="header">
          <div class="header-title"><p>NASAGRESS</p></div>
        </div>
        <div class="main main-blue"></div>
        <div class="footer">
          <div class="footer-modal footer-modal-blue">
            <p class="footer-modal-content">
              <span class="footer-modal-score-blue">Earth 500</span>
              -
              <span class="footer-modal-score-red">Alien 500</span>
            </p>
          </div>
        </div>

        <Star data={this.state.data} />
        <Line />
        <GoogleMap />
      </div>
    );
  }
}
