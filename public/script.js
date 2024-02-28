document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    // Create the OpenLayers overlay for the popup
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    // Add a click event to the close button
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    // Create the OpenLayers map with the OSM layer (centered on EC4M 7RF)
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-0.098350, 51.514248]), // Adjust as needed
            zoom: 14
        })
    });

    // Add the overlay to the map
    map.addOverlay(overlay);

    // Fetch and process restaurants, then create and add the restaurantsLayer
    fetch('/api/restaurants')
        .then(response => response.json())
        .then(data => {
            // Create a vector source and layer for the restaurants
            const restaurantsVectorSource = new ol.source.Vector({});
            const restaurantsLayer = new ol.layer.Vector({
                source: restaurantsVectorSource,
                style: function(feature) {
                    return [
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                anchor: [0.5, 1], // Center the icon over the point
                                src: 'assets/restaurant-icon.png',
                                scale: 0.1
                            }),
                            text: new ol.style.Text({
                                text: feature.get('name'),
                                offsetY: -60, // Offset the text above the icon
                                fill: new ol.style.Fill({
                                    color: '#0000B9' // Dark blue
                                }),
                                stroke: new ol.style.Stroke({
                                    color: '#fff', // Stroke color for better readability
                                    width: 2
                                }),
                                font: 'bold 12px Arial'
                            })
                        })
                    ];
                }
            });           

            // Add a feature for each restaurant to the vector source (limit to 10) - data processing
            data.restaurants.slice(0, 10).forEach(restaurant => {
                const restaurantFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([restaurant.address.location.coordinates[0], restaurant.address.location.coordinates[1]])), // Ensure coordinates are correct
                    name: restaurant.name,
                    cuisines: restaurant.cuisines.map(cuisine => cuisine.name).join(', '),
                    rating: restaurant.rating.starRating,
                    address: `${restaurant.address.firstLine}, ${restaurant.address.city}, ${restaurant.address.postalCode}`
                });

                restaurantsVectorSource.addFeature(restaurantFeature);
            });

            // Add the restaurants layer to the map
            map.addLayer(restaurantsLayer);
        })
        // Log any errors to the console
        .catch(error => console.error('Error fetching restaurant data:', error));


    // Map interaction for displaying popups
    map.on('singleclick', function (evt) {
        // Hide the popup if no feature is found
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            // Get the coordinates and properties of the feature
            var coords = feature.getGeometry().getCoordinates();
            var props = feature.getProperties();
            var infoHtml = `
                <div class="popup-content-wrapper">
                    <h2>${props.name}</h2>
                    <p><strong>Cuisines:</strong> ${props.cuisines}</p>
                    <p><strong>Rating:</strong> ${props.rating} stars</p>
                    <p><strong>Address:</strong> ${props.address}</p>
                </div>
            `;
            content.innerHTML = infoHtml;
            overlay.setPosition(coords);
        });
    });
});
