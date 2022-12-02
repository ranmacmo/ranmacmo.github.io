
console.log("working");

// ADD TILES - BASE MAPS
// ---------------------------------------------------
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

// Adding dark tile layer
let dark = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/dark-v11",
  accessToken: API_KEY
});

// Create a base layer that holds both maps.
let baseMaps = {
  "Streets" : streets,
  "Satellite Streets" : satelliteStreets,
  "Dark" : dark
};



// CREATE MAP OBJECT
// ---------------------------------------------------
// Create the map object with center, zoom level and default layer.
let myMap = L.map('map', {
 	center: [40.7, -94.5],
    zoom: 3,
    layers: [streets]
})

// CREATE TILES OVERLAY
// ---------------------------------------------------
// Add a  layer group for the tectonic plate data
// Add a  layer group for the major earthquake data.
let earthquakes = new L.layerGroup();
let tectonicPlates = new L.LayerGroup() ;
let majorEarthquakes = new L.LayerGroup()

// We define an object that contains the overlays.
// Add a reference to the tectonic plates group to the overlays object.
// Add a reference to the major earthquake group to the overlays object.
let overlays = {
  "Tectonic Plates" : tectonicPlates,
  "Earthquakes": earthquakes,
  "Major Earthquakes": majorEarthquakes
};


// Then we add a control to the map that will allow the user to change
// which layers are visible.
L.control.layers(baseMaps, overlays).addTo(myMap);



// CREATE LEGEND
// ---------------------------------------------------
// Create Constants
const magnitudes = [0, 1, 2, 3, 4, 5];
const colors = [
  "#98ee00",
  "#d4ee00",
  "#eecc00",
  "#ee9c00",
  "#ea822c",
  "#ea2c2c"
];

// Create a legend control object.
let legend = L.control({
  position: "bottomright"
});

// Then add all the details for the legend.
legend.onAdd = function() {
  let div = L.DomUtil.create("div", "info legend");
  // Looping through our intervals to generate a label with a colored square for each interval.
   for (var i = 0; i < magnitudes.length; i++) {
     console.log(colors[i]);
     div.innerHTML +=
       "<i style='background: " + colors[i] + "'></i> " +
       magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
  }
   return div;

};

legend.addTo(myMap);


// FUNCTIONS FOR MAP STYLING
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

function getColorMajor(magnitude) {
    if (magnitude > 6) {
      return "#ea2c2c";
    }
    if (magnitude > 5) {
      return "#ea822c";
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

function styleInfoMajor(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColorMajor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
// Create a style for the lines.
let PlatelineStyle = {
        color: "red",
        weight: 1
        };

// GET DATA SECTION
// ---------------------------------------------------
// EARTHQUAKE GeoJSON
// ------------------
let eqData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(eqData).then(function(data) {
    console.log(data)
  // Creating a GeoJSON layer with retrieved data
  L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            // console.log(data);
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


// TECTONIC PLATE GeoJSON
// ----------------------
 let tekData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tekData).then(function(data) {
    console.log(data)
  // Creating a GeoJSON layer with retrieved data
  L.geoJson(data, {
    style:PlatelineStyle,
    onEachFeature: function(features, layer){
      layer.bindPopup("<h3>this is plate boundary line </h3>")
    }
  }).addTo(tectonicPlates);
    tectonicPlates.addTo(myMap)
});

// MAJOR EARTHQUAKE GeoJSON
// ------------------------
let majorEQData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson"

d3.json(majorEQData).then(function(data) {
    console.log(data)
  // Creating a GeoJSON layer with retrieved data
  L.geoJSON(data, {
    // We turn each feature into a circleMarker on the map.
        pointToLayer: function(feature, latlng) {
            console.log(data);
            return L.circleMarker(latlng);
        },
      // We set the style for each circleMarker using our styleInfo function.
     style: styleInfoMajor,
      // We create a popup for each circleMarker to display the magnitude and
      //  location of the earthquake after the marker has been created and styled.
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
    }).addTo(majorEarthquakes);

    majorEarthquakes.addTo(myMap)
});