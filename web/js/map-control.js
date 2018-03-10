
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

var heatmapLayer = new HeatmapOverlay(cfg);

var map_instance = L.map('mapid', {
  zoom: 13,
  layers: [streets_map, heatmapLayer]
});

var cape_town_coords = [-34.0, 18.523300];
map_instance.setView([cape_town_coords[0], cape_town_coords[1]], 9);


var baseLayers = {
  "Streets": streets_map,
  "Satellite": satellite_map
}

var center_lat = -34;
var center_lng = 18.5;
var lat_diff = 0.2;
var lng_diff = 0.2;
var marker_count = 50;

var points = [];
var markers = L.layerGroup();

for (var i = 0; i < marker_count; i++) {
  var latitude = center_lat + Math.random() * lat_diff * 2 - lat_diff / 2;
  var longitude = center_lng + Math.random() * lng_diff * 2 - lng_diff / 2;
  var name = "Marker number" + i;

  var point = {
    lat: latitude,
    lng: longitude,
    count: Math.random()
  };

  var marker = add_marker(map_instance, latitude, longitude, name);
  //console.log(marker);
  points.push(point);
  marker.addTo(markers);
}

var heatMapData = {
  max: 1.5,
  min: 0,
  data: points
};

console.log(points);

var overlayMaps = {
  "Heatmap" : heatmapLayer,
  "Markers" : markers

};

L.control.layers(baseLayers, overlayMaps).addTo(map_instance);

heatmapLayer.setData(heatMapData);
