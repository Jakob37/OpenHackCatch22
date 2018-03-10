function setup_map() {

  var cape_town_coords = [-34.0, 18.523300];

  var mymap = L.map('mapid').setView([cape_town_coords[0], cape_town_coords[1]], 9);
  // var mymap = L.map('mapid').setView([51.505, -0.09], 13);

  // mapboxgl.accessToken = 'pk.eyJ1IjoibmFtYXRvaiIsImEiOiJjaWk0bW0zYXcwMDQ1dmNtMnhzb21vOXVjIn0.KUflnrb58f71M-j3INmVKQ';
    mapbox_access_token = 'pk.eyJ1IjoibmFtYXRvaiIsImEiOiJjaWk0bW0zYXcwMDQ1dmNtMnhzb21vOXVjIn0.KUflnrb58f71M-j3INmVKQ';

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapbox_access_token
  }).addTo(mymap);
  return mymap;
}


function add_marker(map_instance, lat, lng, info) {
  var marker = L.marker([lat, lng]).addTo(map_instance);
  marker.bindPopup(info);
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



var map_instance = setup_map();
create_test_marker(map_instance);

var center_lat = -34;
var center_lng = 18.5;
var lat_diff = 0.2;
var lng_diff = 0.2;
var marker_count = 50;

for (var i = 0; i < marker_count; i++) {
  var lat = center_lat + Math.random() * lat_diff * 2 - lat_diff / 2;
  var lng = center_lng + Math.random() * lng_diff * 2 - lng_diff / 2;
  var name = "Marker number" + i;
  add_marker(map_instance, lat, lng, name);
}

// add_marker(map_instance, )