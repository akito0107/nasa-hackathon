import React from 'react'
import $ from 'jquery'

/**
 * Map.js
 *
 */

'use strict';

// //////////////////////////////////////////////////////////////////////////
// Const
// //////////////////////////////////////////////////////////////////////////


let map;
let constellationPolyline;
let planets = new google.maps.MVCArray();

export default class GoogleMap extends React.Component {

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

                var i;

                if (map == null) {

                    this.initMap(data.stars[0]);

                    data.stars.forEach((star) => {
                        const planet = this.addMarker(map, star);
                        this.rotatePlanet(planet);
                        this.showPopup(planet);
                        if (star.team_id === "2") {
                            this.changeMarkerColorRed(planet);
                        }
                        if (star.team_id === "1") {
                            this.changeMarkerColorBlue(planet);
                        }
                        planets.push(planet);
                    })
                } else {
                    // add custom marker

                    for (i = 0; i < data.stars.length; i++) {
                        let planet = planets.getAt(i);
                        planet.setPosition(new google.maps.LatLng(parseFloat(data.stars[i].lat), parseFloat(data.stars[i].lon)));
                    }
                }


            },
            error: (xhr, status, err) => {
                if (map == null) {
                    this.defaultMap();
                }
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    loadMainFromServer() {
        $.ajax({
            type: 'GET',
            url: this.props.url,
            data: {
                // TODO
                lon: '4.82092175',
                lat: '14.05479812'
            },
            dataType: 'json',
            cache: false,
            success: (data) => {
                this.setState({data: data});

                var i;

                if (map == null) {

                    this.initMap(data.stars[0]);

                    for (i = 0; i < data.stars.length; i++) {
                        let planet = this.addMarker(map, data.stars[i]);
                        this.rotatePlanet(planet);
                        this.showPopup(planet);
                        this.movePlanet(i, planet);
                        planets.push(planet);
                    }
                } else {
                    // add custom marker
                    for (i = 0; i < data.stars.length; i++) {
                        let planet = planets.getAt(i);
                        planet.setPosition(new google.maps.LatLng(parseFloat(data.stars[i].lat), parseFloat(data.stars[i].lon)));
                    }
                }
            },
            error: (xhr, status, err) => {
                if (map == null) {
                    this.defaultMap();
                }
                console.error(this.props.url, status, err.toString());
            }
        });
    }

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
                if (map == null) {
                    this.defaultMap();
                }
                console.error(this.props.url, status, err.toString());
            }
        });
    }

    // //////////////////////////////////////////////////////////////////////////
    // React lifecycle
    // //////////////////////////////////////////////////////////////////////////

    render() {
        return (
            <div className="GoogleMap">
                <div className="clouds"></div>
                <div className="stars"></div>
                <div id="map"></div>
            </div>
        );
    }

    componentDidMount() {

        this.loadStarsFromServer();
        setInterval(this.loadStarsFromServer.bind(this), 10000);
        // this.loadMainFromServer();
        // setInterval(this.loadMainFromServer.bind(this), this.props.pollInterval);
    }

    // //////////////////////////////////////////////////////////////////////////
    // Map
    // //////////////////////////////////////////////////////////////////////////

    /**
     * Initialize map around Tokyo station
     */
    initMap(data) {

        const mapOption = {
            zoom: 17,
            center: new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon)),
            disableDefaultUI: true
        };

        map = new google.maps.Map(document.getElementById('map'), mapOption);

        this.readTextFile("./mapstyle.json", function (fileContent) {
            const json = JSON.parse(fileContent);
            // apply custom style to map
            map.mapTypes.set('map_style', new google.maps.StyledMapType(json, {name: "Styled Map"}));
            map.setMapTypeId('map_style');
        });
    }

    /**
     * Show default map
     */
    defaultMap() {
        const mapOption = {
            zoom: 17,
            center: new google.maps.LatLng("35.681382", "139.7638953"),
            disableDefaultUI: true
        };

        map = new google.maps.Map(document.getElementById('map'), mapOption);

        this.readTextFile("./mapstyle.json", function (fileContent) {
            const json = JSON.parse(fileContent);
            // apply custom style to map
            map.mapTypes.set('map_style', new google.maps.StyledMapType(json, {name: "Styled Map"}));
            map.setMapTypeId('map_style');
        });

    }

    /**
     * Add marker based on coordinate
     * @param map
     * @param data
     */
    addMarker(map, data) {
        var customSymbol = {
            path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
            fillColor: 'yellow',
            fillOpacity: 0.8,
            scale: 0.2,
            strokeColor: 'gold',
            strokeWeight: 5,
            anchor: {x: 120, y: 120}
        };

        return new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lon)),
            draggable: true,
            title: 'planet',
            icon: customSymbol
        });
    }

    /**
     * Change marker color to blue theme
     *
     * @param marker
     */
    changeMarkerColorBlue(marker) {
        var icon = marker.getIcon();
        icon.fillColor = '#0080d0';
        icon.fillOpacity = 0.2;
        icon.strokeColor = '#0080d0';
        marker.setIcon(icon);
    }

    /**
     * Change marker color to red theme
     *
     * @param marker
     */
    changeMarkerColorRed(marker) {
        var icon = marker.getIcon();
        icon.fillColor = '#d04000';
        icon.fillOpacity = 0.2;
        icon.strokeColor = '#d04000';
        marker.setIcon(icon);
    }

    /**
     * Add path among coordinates
     */
    addPath() {
        // draw path among coordinates
        constellationPolyline = new google.maps.Polyline({
            path: starsInfoStub,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
        constellationPolyline.setMap(map);

    }

    /**
     * Update path
     * @param index
     * @param newLat
     * @param newLng
     */
    updatePath(index, newLat, newLng) {
        // update polyline lat and lng
        var path = constellationPolyline.getPath();
        path.setAt(index, new google.maps.LatLng(newLat, newLng));
    }

    /**
     * Show popup window to explain detail explanation about each planet
     * @param planet
     */
    showPopup(planet) {
        // add event listener
        planet.addListener('click', function () {
            this.changeMarkerColorBlue(planet);
        });
    }

    // //////////////////////////////////////////////////////////////////////////
    // Animation
    // //////////////////////////////////////////////////////////////////////////

    /**
     * Rotate planet marker
     * @param marker
     */
    rotatePlanet(marker) {
        var count = 0;
        var delay = this.getRandomInt(3, 30);
        window.setInterval(function () {
            count = (count + 1);
            var icon = marker.get('icon');
            icon.rotation = count;
            marker.set('icon', icon);
        }, delay);
    }

    /**
     * Move planet marker
     * @param planet
     */
    movePlanet(index, planet) {
        var delay = 500; // 2sec
        window.setInterval(function () {
            // move star
            var newLat = planet.lat;
            var newLng = planet.lon;
            planet.setPosition({lat: newLat, lng: newLng});

        }, delay);
    }


    // //////////////////////////////////////////////////////////////////////////
    // Util
    // //////////////////////////////////////////////////////////////////////////
    /**
     * Returns a random integer between min ( included ) and max ( excluded )
     * @param min
     * @param max
     * @returns {*}
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Read text file from path
     * @param filePath
     * @param callback
     *
     * FIXME: XMLHttpRequest is depricated ... any alternatives?
     */

    readTextFile(filePath, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", filePath, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    callback(allText);
                }
            }
        };
        rawFile.send(null);
    }
}
