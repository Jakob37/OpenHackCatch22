

function setup_map() {

  var cape_town_coords = [-34.0, 18.523300];

  mapbox_access_token = 'pk.eyJ1IjoibmFtYXRvaiIsImEiOiJjaWk0bW0zYXcwMDQ1dmNtMnhzb21vOXVjIn0.KUflnrb58f71M-j3INmVKQ';

  var baseLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapbox_access_token
  });

  var mymap = L.map('mapid', {
    zoom: 13,
    layers: baseLayer
  });

  mymap.setView([cape_town_coords[0], cape_town_coords[1]], 9);
  // var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  // mapboxgl.accessToken = 'pk.eyJ1IjoibmFtYXRvaiIsImEiOiJjaWk0bW0zYXcwMDQ1dmNtMnhzb21vOXVjIn0.KUflnrb58f71M-j3INmVKQ';


  return mymap;
}


function add_marker(map_instance, lat, lng, info) {
  var marker = L.marker([lat, lng]).addTo(map_instance);
  marker.bindPopup(info);
  return marker;
}

function create_test_marker(map_instance) {
  add_marker(map_instance, -34, 18.5, "<b>Popup!</b>")
}

function activate_lnglat_on_click() {

  var popup = L.popup();
  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(mymap);
  }
  mymap.on('click', onMapClick);
}

function onMapZoomLevelChange(ev){
  console.log(map_instance.getZoom());
}

var map_instance = setup_map();
create_test_marker(map_instance);

var center_lat = -34;
var center_lng = 18.5;
var lat_diff = 0.2;
var lng_diff = 0.2;
var marker_count = 50;

let markers = [];

for (var i = 0; i < marker_count; i++) {
  var lat = center_lat + Math.random() * lat_diff * 2 - lat_diff / 2;
  var lng = center_lng + Math.random() * lng_diff * 2 - lng_diff / 2;
  var name = "Marker number" + i;
  let marker = add_marker(map_instance, lat, lng, name);
  markers.push(marker)
}



// Zoom scale
L.control.scale().addTo(map_instance)

// Detect zoom scale
map_instance.on("zoomstart zoom zoomend", onMapZoomLevelChange)




// don't forget to include leaflet-heatmap.js
var testData = {
  max: 8,
  data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
};

var cfg = {
  // radius should be small ONLY if scaleRadius is true (or small radius is intended)
  // if scaleRadius is false it will be the constant radius used in pixels
  "radius": 2,
  "maxOpacity": .8,
  // scales the radius based on map zoom
  "scaleRadius": true,
  // if set to false the heatmap uses the global maximum for colorization
  // if activated: uses the data maximum within the current map boundaries
  //   (there will always be a red spot with useLocalExtremas true)
  "useLocalExtrema": true,
  // which field name in your data represents the latitude - default "lat"
  latField: 'lat',
  // which field name in your data represents the longitude - default "lng"
  lngField: 'lng',
  // which field name in your data represents the data value - default "value"
  valueField: 'count'
};

var heatmapLayer = new HeatmapOverlay(cfg);

map_instance.addLayer(heatmapLayer)

heatmapLayer.setData(testData);


var activeMarkers = L.layerGroup(markers);

var overlayMaps = {
  "Heatmap" : heatmapLayer
};

L.control.layers(null, heatmapLayer).addTo(map_instance);
