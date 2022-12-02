
// Accessing the earthquake GeoJSON URL
let eqData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Adding a street tile layer
let streets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: 'mapbox/streets-v11',
  accessToken: API_KEY
});

// Adding street satellite tile layer
let satelliteStreets = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-streets-v11",
  accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let myMap = L.map('map', {
    center: [39.5, -98.5],
    zoom: 3,
    layers: [streets]
})

// CREATE TILES OVERLAY -------
// Create a base layer that holds both maps.
let baseMaps = {
  "Streets" : streets,
  "Satellite Streets" : satelliteStreets
};


// ADD EARTHQUAKE LAYER ----------

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes
};

// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(myMap);

// END EARTHQUAKE LAYER ----------


// Create a style for the lines.
let myStyle = {
    color: "#ffffa1",
    weight: 2
}

// This function determines the radius of the earthquake marker based on its magnitude.
// Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

function getColor(magnitude) {
    if (magnitude > 5) {
        return "#ea2c2c";
    }
    if (magnitude > 4) {
        return "#ea822c";
    }
    if (magnitude > 3) {
        return "#ee9c00";
    }
    if (magnitude > 2) {
        return "#eecc00";
    }
     if (magnitude > 1) {
        return "#d4ee00";
    }
    return "#98ee00";
}


// This function returns the style data for each of the earthquakes we plot on
// the map. We pass the magnitude of the earthquake into a function
// to calculate the radius.
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

// Grabbing our GeoJSON data.
// d3.json(eqData).then(function(data) {
//     console.log(data);
//   // Creating a GeoJSON layer with the retrieved data.
//   L.geoJSON(data).addTo(myMap);
// });


// ** Grabbing our GeoJSON data
// d3.json(eqData).then(function(data) {
//     console.log(data)
//   // Creating a GeoJSON layer with retrieved data
//   L.geoJson(data, {
//     // style:myStyle,
//     pointToLayer : function(feature, latlng){
//         console.log(latlng)
//         return L.circleMarker(latlng)
//          }
//   }).addTo(myMap);
// });

// ** Grabbing our GeoJSON data
d3.json(eqData).then(function(data) {
    console.log(data)
  // Creating a GeoJSON layer with retrieved data
  L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
      // We create a popup for each circleMarker to display the magnitude and
      //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }

    }).addTo(earthquakes);

    earthquakes.addTo(myMap)
});









