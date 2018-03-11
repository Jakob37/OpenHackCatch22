var blueMarker = L.AwesomeMarkers.icon({
  icon: 'ion-waterdrop',
  markerColor: 'blue',
  prefix: 'ion'
});

var redMarker = L.AwesomeMarkers.icon({
  icon: 'ion-waterdrop',
  markerColor: 'red',
  prefix: 'ion'
});

function add_marker(map_instance, water_request) {

  var id = water_request.id;
  var lat = water_request.lat;
  var lng = water_request.lng;
  var name = water_request.name;
  var address = water_request.address;
  var amount = water_request.amount;
  var date = water_request.date;

  var year = date.substring(0,4);
  var month = date.substring(4,6);
  var day = date.substring(6,8);
  var hour = date.substring(8,10);
  var minute = date.substring(10,12);

  var water_date = new Date(year, month - 1, day, hour, minute);
  var current_date = new Date();

  var time_difference = (current_date - water_date)/1000/60/60;
// console.log(time_difference);
  if (time_difference > 35.5) {
    var marker = L.marker([lat, lng], {icon: redMarker}).addTo(map_instance);
  }
  else {
    var marker = L.marker([lat, lng], {icon: blueMarker}).addTo(map_instance);
  }

  var popup_text = name + "<br>" + address + "<br> Water amount: " + amount +
    " litres<br><br><button type='button' class='btn btn-danger' onclick='test_function(" + id + ")'>" +
    "Take action!</button>";

  marker.bindPopup(popup_text);

  return marker;
}


function test_function(id) {
  console.log("Clicked ID: " + id);

  for (var i = 0; i < water_requests.length; i++) {
    var request = water_requests[i];
    current_request = request;
    if (request.id == id) {
      console.log("hmm");
      generate_popup(request);
      return;
    }
  }
  console.log("Error! No request found!")
}

function generate_popup(water_request) {
  console.log("Generate popup for: " + water_request);

  $("#modal_name").text(water_request.name);
  $("#modal_address").text(water_request.address);
  $("#exampleModal").modal();
}
