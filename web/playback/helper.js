if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            var value;
            for (var i = 0; i < this.length; i++) {
                value = this[i];
                if (predicate.call(arguments[1], value, i, this)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}

function ajax (method, url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if(xhr.status === 404) {
                callback(xhr.status);
            } else {
                callback(JSON.parse(xhr.responseText));
            }
        }
    };
    if (method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/json');
    }
    xhr.send()
};

function animateMarker(marker, geometry, trackFeature) {
    var start, end, timeout, line, updatePosition;
    start = marker.getGeometry().getCoordinates();
    end = geometry.getCoordinates();
    line = new ol.geom.LineString([start, end]);
    timeout = 20;

    updatePosition = function (position, marker) {
        var coordinate;
            // , style;
        coordinate = marker.get('line').getCoordinateAt(position / (duration / timeout));
        // style = marker.getStyle();
        marker.setGeometry(new ol.geom.Point(coordinate));
        trackFeature.getGeometry().appendCoordinate(coordinate);

        if (position < duration / timeout) {
            setTimeout(updatePosition, timeout, position + 0.5, marker);

        } else {
            marker.set('animating', false);
        }
    };

    marker.set('line', line);
    // marker.set('nextCourse', course);
    if (!marker.get('animating')) {
        marker.set('animating', true);
        updatePosition(1, marker);
    }
}