import React from 'react'
import Star from './Star'
import Line from './Line'
import GoogleMap from './GoogleMap'
import $ from 'jquery'

export default class MainFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    loadStarsFromServer() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (data) => {
                this.setState({data: data});
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    componentDidMount() {
        this.loadStarsFromServer();
        // setInterval(this.loadStarsFromServer.bind(this), this.props.pollInterval);
    }

    render() {
        return (
            <div className='MainFrame'>

                <div className="header">
                    <div className="header-title"><p>NASAGRESS</p></div>
                </div>

                <div className="main main-blue">
                    <GoogleMap />
                </div>

                <div className="footer">
                    <div className="footer-modal footer-modal-blue">
                        <p className="footer-modal-content">
                            <span className="footer-modal-score-blue">Earth 500</span>
                            <span className="footer-modal-score-red">Alien 500</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
