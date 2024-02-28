document.addEventListener('DOMContentLoaded', function () {
    // Just Eat API
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const targetUrl = 'https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/EC4M7RF';
    fetch(proxyUrl + targetUrl)
        .then(response => response.json())
        .then(data => {
            // Process the data to get only the required information
            const processedRestaurants = data.restaurants.slice(0, 10).map(restaurant => ({
                name: restaurant.name,
                cuisines: restaurant.cuisines.map(cuisine => cuisine.name).join(', '),
                rating: restaurant.rating.starRating,
                address: `${restaurant.address.firstLine}, ${restaurant.address.city}, ${restaurant.address.postalCode}`
            }));

            // Log the processed data
            console.log(processedRestaurants);

        })
        .catch(error => console.error('Error fetching restaurant data:', error));

    // Create a new OpenLayers map
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-0.098350, 51.514248]), // Longitude, Latitude
            zoom: 18 // Adjust zoom level as needed
        })
    });
});
