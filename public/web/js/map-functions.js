

function add_marker(map_instance, lat, lng, info) {
  var blueMarker = L.AwesomeMarkers.icon({
    icon: 'ion-waterdrop',
    markerColor: 'blue',
    prefix: 'ion'
  });

  var marker = L.marker([lat, lng], {icon: blueMarker}).addTo(map_instance);
  marker.bindPopup(info);
  return marker;
}
