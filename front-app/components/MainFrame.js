import React from 'react'
import GoogleMap from './GoogleMap'
import $ from 'jquery'

export default class MainFrame extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    styles() {
        return {
            main: {
                blue: "main main-blue",
                red: "main main-red",
                white: "main"
            },
            footer_modal: {
                blue: "footer-modal footer-modal-blue",
                red: "footer-modal footer-modal-red",
                white: "footer-modal"
            }
        }
    }

    // //////////////////////////////////////////////////////////////////////////
    // API
    // //////////////////////////////////////////////////////////////////////////

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
            success: (data) => {
                this.setState({data: data});
            },
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
            success: (data) => {
                this.setState({data: data});
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    // //////////////////////////////////////////////////////////////////////////
    // React lifecycle
    // //////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        this.loadStarsFromServer();
        // TODO:
        // setInterval(this.loadStarsFromServer.bind(this), this.props.pollInterval);
    }

    render() {
        const styles = this.styles();
        var style_main = styles.main.white;
        var style_footer_modal = styles.footer_modal.white;

        this.props.data.map((team_id)=> {
            if(team_id == 1) {
                style_main = styles.main.blue;
                style_footer_modal = styles.footer_modal.blue;
            } else if(team_id == 2) {
                style_main = styles.main.red;
                style_footer_modal = styles.footer_modal.red;
            }
        })
        
        // TODO: 受け渡し
        var scores = [];
        
        return (
            <div className='MainFrame'>
                <div className="header">
                    <div className="header-title"><p>NASAGRESS</p></div>
                </div>
                    <div className={style_main}>
                    <GoogleMap url="http://localhost:3000/main" pollInterval={5000}/>
                </div>
                <div className="footer">
                    <div className={style_footer_modal}>
                        <p className="footer-modal-content">
                            <span className="footer-modal-score-blue">Earth {scores.blue_score}</span>
                            <span className="footer-modal-score-red">Alien {scores.red_score}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}
