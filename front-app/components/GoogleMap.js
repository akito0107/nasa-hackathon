import React from 'react'

/**
 * Map.js
 *
 */

'use strict';

// //////////////////////////////////////////////////////////////////////////
// Const
// //////////////////////////////////////////////////////////////////////////

const sampleCoordinates = [
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

        // add custom marker
        for (var i = 0; i < sampleCoordinates.length; i++) {
            let planet = this.addMarker(map, sampleCoordinates[i]);
            this.rotatePlanet(planet);
            this.showPopup(map, planet);
        }

        this.addPath();
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
            center: sampleCoordinates[0]
        };

        map = new google.maps.Map(document.getElementById('map'), mapOption);

        console.log(map);

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
     * @param callback
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
        const constellationPath = new google.maps.Polyline({
            path: sampleCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 2
        });
        constellationPath.setMap(map);

    }

    /**
     * Show popup window to explain detail explanation about each planet
     * @param map
     * @param planet
     */
    showPopup(map, planet) {
        // add event listener
        planet.addListener('click', function () {
            const infoWindow = new google.maps.InfoWindow({
                content: "A Planet Clicked!"
            });
            infoWindow.open(map, planet);
        });
    }

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
