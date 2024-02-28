document.addEventListener('DOMContentLoaded', function () {
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([150.644, -34.397]), // Long, Lat
            zoom: 8
        })
    });

    // Example of adding a marker to the map
    var marker = new ol.Feature({
        geometry: new ol.geom.Point(
            ol.proj.fromLonLat([150.644, -34.397]) // Long, Lat
        ),
    });

    var vectorSource = new ol.source.Vector({
        features: [marker]
    });

    var markerVectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });

    map.addLayer(markerVectorLayer);
});
