/**
 * Map.js
 *
 * TODO: secure API key before publishing
 */

// //////////////////////////////////////////////////////////////////////////
// Const
// //////////////////////////////////////////////////////////////////////////
var sampleStars = [
    {
        id: 0,
        Position: {
            lat: 35.681382,
            lng: 139.7638953
        }
    }, {
        id: 1,
        Position: {
            lat: 35.6845628,
            lng: 139.7649038
        }
    }, {
        id: 2,
        Position: {
            lat: 35.6845628,
            lng: 139.7539038
        }
    }
];

var constellationPolyline;

// //////////////////////////////////////////////////////////////////////////
// Map
// //////////////////////////////////////////////////////////////////////////

/**
 * Initialize map around Tokyo station
 */
function initMap() {

    const mapOption = {
        zoom: 17,
        center: sampleStars[0].Position,
        disableDefaultUI: true
    };

    const map = new google.maps.Map(document.getElementById('map'), mapOption);

    readTextFile("./mapstyle.json", function (fileContent) {
        const json = JSON.parse(fileContent);
        // apply custom style to map
        map.mapTypes.set('map_style', new google.maps.StyledMapType(json, {name: "Styled Map"}));
        map.setMapTypeId('map_style');
    });

    var constellationPaths = [];
    for (var key in sampleStars) {
        constellationPaths.push(sampleStars[key].Position);
    }
    constellationPolyline = new google.maps.Polyline({
        path: constellationPaths,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2
    });
    constellationPolyline.setMap(map);

    // add custom marker
    for (var i = 0; i < sampleStars.length; i++) {
        addMarker(map, sampleStars[i].Position, function (planet) {
            rotatePlanet(planet);
            showPopup(map, planet);
            movePlanet(planet, sampleStars[i], function (star) {
                updatePolyline(star);
            });
        });
    }


}

// //////////////////////////////////////////////////////////////////////////
// DOM
// //////////////////////////////////////////////////////////////////////////

/**
 * Add marker based on coordinate
 * @param map
 * @param coordinate
 * @param callback
 */
function addMarker(map, coordinate, callback) {
    var customSymbol = {
        path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
        fillColor: 'yellow',
        fillOpacity: 0.8,
        scale: 0.2,
        strokeColor: 'gold',
        strokeWeight: 5,
        anchor: {x: 120, y: 120}
    };

    const planet = new google.maps.Marker({
        map: map,
        position: coordinate,
        draggable: true,
        title: 'planet',
        icon: customSymbol
    });

    callback(planet);
}

/**
 * Show popup window to explain detail explanation about each planet
 * @param map
 * @param planet
 */
function showPopup(map, planet) {
    // add event listener
    planet.addListener('click', function () {
        const infoWindow = new google.maps.InfoWindow({
            content: "A Planet Clicked!"
        });
        infoWindow.open(map, planet);
    });
}

// //////////////////////////////////////////////////////////////////////////
// Animation
// //////////////////////////////////////////////////////////////////////////

/**
 * Rotate planet marker
 * @param marker
 */
function rotatePlanet(marker) {
    var count = 0;
    var delay = getRandomInt(3, 30);
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
function movePlanet(planet, star, callback) {
    var count = 0;
    var delay = 500; // 2sec
    window.setInterval(function () {
        count = count + 1;

        // move star
        var newLat = planet.position.lat() + count / 1000000;
        var newLng = planet.position.lng() + count / 1000000;
        planet.setPosition({lat: newLat, lng: newLng});

        // update lat and lng
        star.Position.lat = newLat;
        star.Position.lng = newLng;
        callback(star);

    }, delay);
}

/**
 * Update poly-line based on stars coordinates
 * @param map
 */
function updatePolyline(star) {

    var path = constellationPolyline.getPath();
    path.setAt(star.id, new google.maps.LatLng(star.Position.lat, star.Position.lng));

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
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Read text file from path
 * @param filePath
 * @param callback
 *
 * FIXME: XMLHttpRequest is depricated ... any alternatives?
 */
function readTextFile(filePath, callback) {
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
