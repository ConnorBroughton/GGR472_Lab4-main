Mapbox Collision Hexgrid Visualization

Overview

This project visualizes pedestrian and cyclist collision data on a Mapbox map. It uses Turf.js to generate a hexgrid overlay, aggregating collision data into hexagons that are color-coded based on collision density.

Features

- Displays a Mapbox map centered on Toronto.

- Loads collision data from a GeoJSON file.

- Aggregates collisions into a hexgrid.

- Filters out hexagons with zero collisions.

- Colors hexagons based on collision density.

- Displays the number of collisions per hexagon.

Technologies Used

- Mapbox GL JS for map rendering.

- Turf.js for spatial analysis.

- JavaScript for handling data and map interactions.

Usage

- The map loads automatically with collision data points.

- The hexgrid is color-coded based on the number of collisions.

- Each hexagon displays the collision count.