

function add_marker(map_instance, water_request) {

  var id = water_request.id;
  var lat = water_request.lat;
  var lng = water_request.lng;
  var name = water_request.name;
  var address = water_request.address;
  var amount = water_request.amount;

  var blueMarker = L.AwesomeMarkers.icon({
    icon: 'ion-waterdrop',
    markerColor: 'blue',
    prefix: 'ion'
  });

  var marker = L.marker([lat, lng], {icon: blueMarker}).addTo(map_instance);

  var popup_text = name + "<br>" + address + "<br> Water amount: " + amount +
    "<br><br><button type='button' class='btn btn-danger' onclick='test_function(" + id + ")'>" +
    "Take action!</button>";

  marker.bindPopup(popup_text);

  return marker;
}


function test_function(id) {
  console.log("Clicked ID: " + id);
}

// function add_marker(map_instance, lat, lng, info) {
//   var blueMarker = L.AwesomeMarkers.icon({
//     icon: 'ion-waterdrop',
//     markerColor: 'blue',
//     prefix: 'ion'
//   });
//
//   var marker = L.marker([lat, lng], {icon: blueMarker}).addTo(map_instance);
//   marker.bindPopup(info);
//   return marker;
// }
