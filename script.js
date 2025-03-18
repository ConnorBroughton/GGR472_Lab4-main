mapboxgl.accessToken = 'pk.eyJ1IjoiY29ubm9yYnJvdWdodG9uIiwiYSI6ImNtNmllajk3dDA4MnYya29vcmRhZ3pmMmkifQ.rVteR2UEyh7d5e4JIP3zCA'; //****ADD YOUR PUBLIC ACCESS TOKEN*****

// Initialize map and edit to your preference
const map = new mapboxgl.Map({
    container: 'map', // container id in HTML
    style: 'mapbox://styles/mapbox/standard',  // ****ADD MAP STYLE HERE *****
    center: [-79.39, 43.65],  // starting point, longitude/latitude
    zoom: 11 // starting zoom level
});

let collisionData;
fetch('https://raw.githubusercontent.com/ConnorBroughton/GGR472_Lab4-main/refs/heads/main/data/pedyc-collision-18_23.geojson')
.then(response => response.json()) // Convert the response to JSON
    .then(data => {
        collisionData = data; // Store the data in the variable
        console.log(collisionData); // Log data to confirm it's loaded

        // Add the data to the map once it's loaded
        map.on('load', () => {
            map.addSource('collisions', {
                type: 'geojson',
                data: collisionData
            });

            map.addLayer({
                id: 'collision-points',
                type: 'circle',
                source: 'collisions',
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#ff0000'
                }
            });
        });
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
/*--------------------------------------------------------------------
Step 2: VIEW GEOJSON POINT DATA ON MAP
--------------------------------------------------------------------*/
//HINT: Create an empty variable
//      Use the fetch method to access the GeoJSON from your online repository
//      Convert the response to JSON format and then store the response in your new variable



/*--------------------------------------------------------------------
    Step 3: CREATE BOUNDING BOX AND HEXGRID
--------------------------------------------------------------------*/
//HINT: All code to create and view the hexgrid will go inside a map load event handler
//      First create a bounding box around the collision point data
//      Access and store the bounding box coordinates as an array variable
//      Use bounding box coordinates as argument in the turf hexgrid function
//      **Option: You may want to consider how to increase the size of your bbox to enable greater geog coverage of your hexgrid
//                Consider return types from different turf functions and required argument types carefully here



/*--------------------------------------------------------------------
Step 4: AGGREGATE COLLISIONS BY HEXGRID
--------------------------------------------------------------------*/
//HINT: Use Turf collect function to collect all '_id' properties from the collision points data for each heaxagon
//      View the collect output in the console. Where there are no intersecting points in polygons, arrays will be empty



// /*--------------------------------------------------------------------
// Step 5: FINALIZE YOUR WEB MAP
// --------------------------------------------------------------------*/
//HINT: Think about the display of your data and usability of your web map.
//      Update the addlayer paint properties for your hexgrid using:
//        - an expression
//        - The COUNT attribute
//        - The maximum number of collisions found in a hexagon
//      Add a legend and additional functionality including pop-up windows


