

function add_marker(map_instance, lat, lng, info) {
  var marker = L.marker([lat, lng]).addTo(map_instance);
  marker.bindPopup(info);
  return marker;
}
