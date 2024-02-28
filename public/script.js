document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    // Just Eat API
    fetch('/api/restaurants')
        .then(response => response.json())
        .then(data => {
            const restaurantsVectorSource = new ol.source.Vector({});
            restaurantsLayer = new ol.layer.Vector({
                source: restaurantsVectorSource,
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        src: 'assets/restaurant-icon.png', // Provide the path to your marker icon
                        scale: 0.1
                    })
                })
            });

            // Process the restaurant data and add it to the restaurants layer
            data.restaurants.slice(0, 10).forEach(restaurant => {
                const restaurantFeature = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat([restaurant.address.location.coordinates[0], restaurant.address.location.coordinates[1]])), // Use actual longitude and latitude
                    name: restaurant.name,
                    cuisines: restaurant.cuisines.map(cuisine => cuisine.name).join(', '),
                    rating: restaurant.rating.starRating,
                    address: `${restaurant.address.firstLine}, ${restaurant.address.city}, ${restaurant.address.postalCode}`
                });

                restaurantsVectorSource.addFeature(restaurantFeature);
            });

            // Create OpenLayers map with OSM base layer
            var map = new ol.Map({
                target: 'map',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    }),
                    restaurantsLayer // Add the restaurants layer to the map
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([-0.098350, 51.514248]),
                    zoom: 14
                })
            });
        })
        .catch(error => console.error('Error fetching restaurant data:', error));

    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    // Add overlay to the map
    map.addOverlay(overlay);

    // Modify this part to include the overlay logic
    map.on('singleclick', function (evt) {
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            var coord = feature.getGeometry().getCoordinates();
            var props = feature.getProperties();
            var infoHtml = `
                <h2>${props.name}</h2>
                <p><strong>Cuisines:</strong> ${props.cuisines}</p>
                <p><strong>Rating:</strong> ${props.rating}</p>
                <p><strong>Address:</strong> ${props.address}</p>
            `;
            content.innerHTML = infoHtml;
            overlay.setPosition(coord);
        });
    });

    // Click event to display restaurant information
    /*
    map.on('singleclick', function (evt) {
        map.forEachFeatureAtPixel(evt.pixel, function (feature) {
            // Display restaurant information
            // You can replace this alert with a more sophisticated UI element
            alert(`Name: ${feature.get('name')}\nCuisines: ${feature.get('cuisines')}\nRating: ${feature.get('rating')}\nAddress: ${feature.get('address')}`);
        });
    });
    */
});
