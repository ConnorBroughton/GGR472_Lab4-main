document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29ubm9yYnJvdWdodG9uIiwiYSI6ImNtNmllajk3dDA4MnYya29vcmRhZ3pmMmkifQ.rVteR2UEyh7d5e4JIP3zCA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-79.39, 43.71],
        zoom: 10,
    });

    // Add control options to the map
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());

    let collisionData;

    fetch('https://raw.githubusercontent.com/ConnorBroughton/GGR472_Lab4-main/main/pedcyc_collision_06-21.geojson')
        .then(response => response.json())
        .then(data => {
            collisionData = data;
            console.log('Collision Data:', collisionData);

            // Add the data to the map once it's loaded
            map.on('load', () => {
                // Add collision source to the map
                map.addSource('collisions', {
                    type: 'geojson',
                    data: collisionData
                });

                // Step 4: Aggregate collisions by hexgrid
                aggregateCollisionsByHexgrid(collisionData);
            });
        })
        .catch(error => console.error('Error loading GeoJSON:', error));

    // Function to aggregate collisions by hexgrid
    function aggregateCollisionsByHexgrid(collisionData) {
        // Define the bounding box for the hexgrid (use the envelope of collision data)
        const bbox = turf.bbox(collisionData);

        // Create a hexgrid within the bounding box
        const cellSize = 1; // Size of each hexagon in kilometers
        let hexgrid = turf.hexGrid(bbox, cellSize, { units: 'kilometers' });

        // Aggregate collision points into hexagons
        let aggregated = turf.collect(hexgrid, collisionData, '_id', 'collisions');

        // Filter out hexagons with zero collisions
        aggregated.features = aggregated.features.filter(feature => feature.properties.collisions.length > 0);

        console.log('Filtered Aggregated Hexgrid Data:', aggregated);

        // Add the hexgrid to the map
        map.addSource('hexgrid', {
            type: 'geojson',
            data: aggregated
        });

        map.addLayer({
            id: 'hexgrid-layer',
            type: 'fill',
            source: 'hexgrid',
            paint: {
                'fill-color': [
                    'interpolate', ['linear'], ['length', ['get', 'collisions']],
                    1, '#00ff00',   // Green (low collisions)
                    10, '#ffff00',   // Yellow (moderate collisions)
                    20, '#ff9900',  // Orange (high collisions)
                    50, '#ff0000'   // Red (very high collisions)
                ],
                'fill-opacity': 0.5,
                'fill-outline-color': '#000000'
            }
        });

        // Add collision count labels to each hexagon
        map.addLayer({
            id: 'hexgrid-labels',
            type: 'symbol',
            source: 'hexgrid',
            layout: {
                'text-field': ['to-string', ['length', ['get', 'collisions']]],
                'text-size': 12,
                'text-anchor': 'center'
            },
            paint: {
                'text-color': '#000000',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1
            }
        });
    }
});


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


