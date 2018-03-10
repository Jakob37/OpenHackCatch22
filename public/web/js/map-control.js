
mapbox_access_token = 'pk.eyJ1IjoibmFtYXRvaiIsImEiOiJjaWk0bW0zYXcwMDQ1dmNtMnhzb21vOXVjIn0.KUflnrb58f71M-j3INmVKQ';

var streets_map = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: mapbox_access_token
});
var satellite_map = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.satellite',
  accessToken: mapbox_access_token
});

var cape_town_coords = [-34.0, 18.523300];

var baseLayers = {
  "Streets": streets_map,
  "Satellite": satellite_map
};

function generate_dummy_data(marker_count) {

  var center_lat = -34;
  var center_lng = 18.5;
  var lat_diff = 0.2;
  var lng_diff = 0.2;
  // var marker_count = 50;
  var points = [];

  for (var i = 0; i < marker_count; i++) {
    var latitude = center_lat + Math.random() * lat_diff * 2 - lat_diff / 2;
    var longitude = center_lng + Math.random() * lng_diff * 2 - lng_diff / 2;
    var name = "Marker number" + i;

    var minutes_since_submit = Math.random() * 120000;

    var point = {
      id: i,
      lat: latitude,
      lng: longitude,
      count: Math.random() + 0.5,
      name: name,
      water: 25,
      address: "Luleå",
      minutes_since_submit: minutes_since_submit
    };

    points.push(point);
  }
  return points;
}

var heatmapLayer;
var markerLayer;
var map_instance;

function setup_data(water_requests) {

  heatmapLayer = new HeatmapOverlay(cfg);
  markerLayer = L.layerGroup();

  if (map_instance !== undefined) {
    map_instance.remove();
  }
  map_instance = L.map('mapid', {
    zoom: 13,
    layers: [streets_map, heatmapLayer, markerLayer]
  });

  var default_zoom = 12;
  map_instance.setView([cape_town_coords[0], cape_town_coords[1]], default_zoom);

  for (var i = 0; i < water_requests.length; i++) {
    var water_request = water_requests[i];
    try {
      var marker = add_marker(map_instance, water_request);
      // var marker = add_marker(map_instance, point.lat, point.lng, point.name);
      marker.addTo(markerLayer);
      marker.point = water_request;
    }
    catch (e) {
      console.log("Failed parsing entry: " + water_request);
    }
  }

  var heatMapData = {
    max: 2,
    min: 0,
    data: water_requests
  };

  var overlayMaps = {
    "Heatmap" : heatmapLayer,
    "Markers" : markerLayer
  };

  L.control.layers(baseLayers, overlayMaps).addTo(map_instance);
  heatmapLayer.setData(heatMapData);
  map_instance.on("zoomstart zoom zoomend", onMapZoomLevelChange);

  onMapZoomLevelChange();
}

// var water_requests = generate_dummy_data(50);
// setup_data(water_requests);

function onMapZoomLevelChange(ev){
  var zoom_level = map_instance.getZoom();

  if (zoom_level > 11) {
    if (map_instance.hasLayer(heatmapLayer)) {
      console.log('Removing heat layer');
      map_instance.removeLayer(heatmapLayer);
    }
    if (!map_instance.hasLayer(markerLayer)) {
      console.log('Adding marker layer');
      map_instance.addLayer(markerLayer);
    }
  }
  else if (zoom_level <= 11) {
    if (!map_instance.hasLayer(heatmapLayer)) {
      console.log('Adding heat layer');
      map_instance.addLayer(heatmapLayer);
    }
    if (map_instance.hasLayer(markerLayer)) {
      console.log('Removing marker layer');
      map_instance.removeLayer(markerLayer);
    }
  }
}
