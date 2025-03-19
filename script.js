document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29ubm9yYnJvdWdodG9uIiwiYSI6ImNtNmllajk3dDA4MnYya29vcmRhZ3pmMmkifQ.rVteR2UEyh7d5e4JIP3zCA';
// mapbox styling
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-79.39, 43.71],
        zoom: 10,
    });
//map controls
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.FullscreenControl());
//collision dat input
    let collisionData;
//fetching collision data
    fetch('https://raw.githubusercontent.com/ConnorBroughton/GGR472_Lab4-main/main/pedcyc_collision_06-21.geojson')
        .then(response => response.json())
        .then(data => {
            collisionData = data;
            console.log('Collision Data:', collisionData);

            map.on('load', () => {
                map.addSource('collisions', {
                    type: 'geojson',
                    data: collisionData
                });
                //aggregating collision data to put in a hexgrid
                aggregateCollisionsByHexgrid(collisionData);

                //bounding box button
                document.getElementById('bboxbutton').addEventListener('click', () => {
                    let envresult = turf.envelope(collisionData);

                    if (!map.getSource('envelopeGeoJSON')) {
                        map.addSource('envelopeGeoJSON', {
                            'type': 'geojson',
                            'data': envresult
                        });

                        map.addLayer({
                            'id': 'boxenvelope',
                            'type': 'fill',
                            'source': 'envelopeGeoJSON',
                            'paint': {
                                'fill-color': 'blue',
                                'fill-opacity': 0.3,
                                'fill-outline-color': 'black'
                            }
                        });

                        document.getElementById('bboxbutton').disabled = true;
                    }
                });
            });
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
        
        //displaying hexgrid data
        function aggregateCollisionsByHexgrid(collisionData) {
            const bbox = turf.bbox(collisionData);
            const cellSize = 1;
            let hexgrid = turf.hexGrid(bbox, cellSize, { units: 'kilometers' });
        
            // Collecting collisions for each hexagon
            let aggregated = turf.collect(hexgrid, collisionData, '_id', 'collisions');
        
            // Storing collision count in properties
            aggregated.features.forEach(feature => {
                feature.properties.collision_count = feature.properties.collisions.length; 
            });
        
            // Filtering out hexagons with less than 1 collision (ie in the lake)
            aggregated.features = aggregated.features.filter(feature => feature.properties.collision_count > 0);
        
            map.addSource('hexgrid', {
                type: 'geojson',
                data: aggregated
            });
        
            //adding the hexgrid to the display
            map.addLayer({
                id: 'hexgrid-layer',
                type: 'fill',
                source: 'hexgrid',
                paint: {
                    'fill-color': [
                        'interpolate', ['linear'], ['get', 'collision_count'],
                        1, '#00ff00',
                        10, '#ffff00',
                        20, '#ff9900',
                        50, '#ff0000'
                    ],
                    'fill-opacity': 0.5,
                    'fill-outline-color': '#000000'
                }
            });
        
            map.addLayer({
                id: 'hexgrid-labels',
                type: 'symbol',
                source: 'hexgrid',
                layout: {
                    'text-field': ['to-string', ['get', 'collision_count']], 
                    'text-size': 12,
                    'text-anchor': 'center'
                },
                paint: {
                    'text-color': '#000000',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 1
                }
            });
        
            //adding interactivity to the hexgrids
            map.on('click', 'hexgrid-layer', (e) => {
                let collisions = e.features[0].properties.collision_count;
        
                new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<h4>Collisions: ${collisions}</h4>`)
                    .addTo(map);
            });
        
            map.on('mouseenter', 'hexgrid-layer', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
        
            map.on('mouseleave', 'hexgrid-layer', () => {
                map.getCanvas().style.cursor = '';
            });
        }
        

})



