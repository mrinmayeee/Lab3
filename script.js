//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibXJpbm1heWVlZSIsImEiOiJjbGRtMHNobWkwMnRhM25teTJ6Y3poYWY3In0.7jz_b3HAoeEVcCmXB3qCKA';

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mrinmayeee/cldm1tcb9002d01rywna3652e',
    center: [-79.444135, 43.743110], //longitude and latitude
    zoom: 10,
});

//Adding zoom and rotation controls to my map
map.addControl(new mapboxgl.NavigationControl());

//Adding a button to go to fullscreen and back
map.addControl(new mapboxgl.FullscreenControl());


//Adding the data source and initial visiualization of layer
map.on('load', () => {

    map.addSource('green_spaces', {
        type: 'vector',
        url: 'mapbox://mrinmayeee.03n4gpx9'
    });

    map.addLayer(
        {
            'id': 'green_place',
            'type': 'circle',
            'source': 'green_spaces',
            'source-layer': 'green_places-61xa28',
            'paint': { //adding expressions to modify the circle radius and colour options
                'circle-radius': [
                    'interpolate', //expression to smoothly transition from smaller to larger circle markers
                    ['linear'], //linear interpolation between starting and ending circle radius 
                    ['zoom'], //expression that makes the circle radius change as the zoom level changes
                    7, 1, // when zoom level is at 7 or lower, the circle radius will be 1px
                    13, 12 // when zoom level is at 13 or higher, the circle radius will be 12px
                ],
                'circle-color': [
                    'step', // expression to get a graduated colours for the location markers 
                    ['get', 'Distance'], // GET expression retrieves the value from 'Distance' in the original geojson file (later turned into a tileset)
                    '#0077b6', // colour for distances less than 1000m
                    1000, '#0077b6', // colour for distances >= 1000m
                    2000, '#00b4d8', // colour for distances >= 2000m
                    3000, '#90e0ef' // colour for distances >= 3000m
                ],
                'circle-stroke-width': 1,
                'circle-stroke-color': '#000',
            },
        });
});

//POP-UP ON CLICK EVENT
map.on('mouseenter', 'green_place', () => {
    map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over a green place marker
});

map.on('mouseleave', 'green_place', () => {
    map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves the green place marker
});




map.on('click', 'green_place', (e) => {
    new mapboxgl.Popup() //Create a new popup box on each click
        .setLngLat(e.lngLat) //Use method to set the coordinates of popup based on where the user clicks
        .setHTML("<b>Name:</b> " + e.features[0].properties.Name + "<br>" +
            "<b>Distance from UofT campus:</b> " + e.features[0].properties.Distance + "m" + "<br>" +
            "<b>Walking time:</b> " + e.features[0].properties.Walk + "<br>" +
            "<b>Biking time:</b> " + e.features[0].properties.Bike) // add the popup text 
        .addTo(map); //Show popup on map
})
