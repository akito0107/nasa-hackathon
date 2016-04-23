import React from 'react'
import Modal from "./Modal";

/**
 * Map.js
 *
 */

'use strict';

// //////////////////////////////////////////////////////////////////////////
// Const
// //////////////////////////////////////////////////////////////////////////

const starsInfoStub = [
    {
        lat: 35.681382,
        lng: 139.7638953
    },
    {
        lat: 35.6845628,
        lng: 139.7649038
    },
    {
        lat: 35.6845628,
        lng: 139.7539038
    }
];

let map;
let constellationPolyline;

export default class GoogleMap extends React.Component {


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

        this.initMap();

        // TODO:
        // this.addPath();
        //
        // // add custom marker
        // for (var i = 0; i < starsInfoStub.length; i++) {
        //     let planet = this.addMarker(map, starsInfoStub[i]);
        //     this.rotatePlanet(planet);
        //     this.showPopup(planet);
        //     this.movePlanet(i, planet);
        // }

    }

    // //////////////////////////////////////////////////////////////////////////
    // Map
    // //////////////////////////////////////////////////////////////////////////

    /**
     * Initialize map around Tokyo station
     */

    initMap() {

        const mapOption = {
            zoom: 17,
            center: starsInfoStub[0],
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
     * @param coordinate
     */

    addMarker(map, coordinate) {
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
            position: coordinate,
            draggable: true,
            title: 'planet',
            icon: customSymbol
        });
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
     * Show popup window to explain detail explanation about each planet
     * @param planet
     */
    showPopup(planet) {
        // add event listener
        planet.addListener('click', function () {
            Modal.handleClick();
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
        var count = 0;
        var delay = 500; // 2sec
        window.setInterval(function () {
            count = count + 1;

            // move star
            var newLat = planet.position.lat() + count / 1000000;
            var newLng = planet.position.lng() + count / 1000000;
            planet.setPosition({lat: newLat, lng: newLng});

            // update polyline lat and lng
            var path = constellationPolyline.getPath();
            path.setAt(index, new google.maps.LatLng(newLat, newLng));

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
