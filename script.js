//Define access token
mapboxgl.accessToken = 'pk.eyJ1IjoibXJpbm1heWVlZSIsImEiOiJjbGRtMHNobWkwMnRhM25teTJ6Y3poYWY3In0.7jz_b3HAoeEVcCmXB3qCKA'; 

//Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mrinmayeee/cldm1tcb9002d01rywna3652e',
    center: [-79.444135, 43.743110], //longitude and la
    zoom: 10,
});

//Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

//Add a button to go to fullscreen and back
map.addControl(new mapboxgl.FullscreenControl());


//Add data source and draw initial visiualization of layer
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
        'paint': {
            'circle-radius': [
                 'interpolate', //INTERPOLATE expression produces continuous results by interplating between value pairs
                 ['linear'], //linear interpolation between stops but could be exponential ['exponential', base] where base controls rate at which output increases
                 ['zoom'], //ZOOM expression changes appearance with zoom level
                 7, 1, // when zoom level is 8 or less, circle radius will be 1px
                 13, 12 // when zoom level is 12 or greater, circle radius will be 10px
            ], 
            'circle-color': [
                'step', // STEP expression produces stepped results based on value pairs
                ['get', 'Distance'], // GET expression retrieves property value from 'capacity' data field
                '#0077b6', // Colour assigned to any values < first step
                1000, '#0077b6', // Colours assigned to values >= each step
                2000, '#00b4d8',
                3000, '#90e0ef'
            ]
        },            
    });
});

//ADD POP-UP ON CLICK EVENT
//--------------------------------------------------------------------*/
    map.on('mouseenter', 'green_place', () => {
        map.getCanvas().style.cursor = 'pointer'; //Switch cursor to pointer when mouse is over provterr-fill layer
    });

    map.on('mouseleave', 'green_place', () => {
     map.getCanvas().style.cursor = ''; //Switch cursor back when mouse leaves provterr-fill layer
     //map.setFilter("green_spaces",['==', ['get', 'Distance(m)'], '']);
    });

    


    map.on('click', 'green_place', (e) => {
     new mapboxgl.Popup() //Declare new popup object on each click
        .setLngLat(e.lngLat) //Use method to set coordinates of popup based on mouse click location
        .setHTML("<b>Name:</b> " + e.features[0].properties.Name + "<br>" +
        "<b>Distance from campus:</b> " + e.features[0].properties.Distance + "m" + "<br>" +
        "<b>Walking time:</b> " + e.features[0].properties.Walk + "<br>" +
        "<b>Biking time:</b> " + e.features[0].properties.Bike)
        .addTo(map); //Show popup on map
    })
