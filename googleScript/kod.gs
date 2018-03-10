function onEdit() {
  addressToPosition();
}

function getGeocodingRegion() {
  return 'za';
}


function setGeocodingRegion(region) {
  PropertiesService.getDocumentProperties().setProperty('GEOCODING_REGION', region);
  updateMenu();
}

function addressToPosition() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('requests');
  var cells = sheet.getRange("requests!E2:G");
  var lastRow = sheet.getLastRow();
  var addressColumn = 1;
  var addressRow;
  var latColumn = addressColumn + 1;
  var lngColumn = addressColumn + 2;
  var geocoder = Maps.newGeocoder().setRegion(getGeocodingRegion());
  var location;
  var townName = 'Cape Town';
  
  for (addressRow = 1; addressRow < lastRow; ++addressRow) {
    
    // Skip rows without addresses and rows that already have a geocode
    if(!cells.getCell(addressRow, addressColumn+1).isBlank() || cells.getCell(addressRow, addressColumn).isBlank()) {
      continue;
    }
    
    // Read the address, add townName to address to make geocoding easier.
    var address = cells.getCell(addressRow, addressColumn).getValue() + ' ' + townName;
    
    // Geocode the address and plug the lat, lng pair into the 
    // 2nd and 3rd elements of the current range row.
    location = geocoder.geocode(address);
   
    // Only change cells if geocoder seems to have gotten a 
    // valid response.
    if (location.status == 'OK') {
      lat = location["results"][0]["geometry"]["location"]["lat"];
      lng = location["results"][0]["geometry"]["location"]["lng"];
      
      cells.getCell(addressRow, latColumn).setValue(lat);
      cells.getCell(addressRow, lngColumn).setValue(lng);
    }
  }
};

function positionToAddress() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('requests');
  var cells = sheet.getRange("requests!E2:G");
  var lastRow = sheet.getLastRow();
  var addressColumn = 1;
  var addressRow;
  var latColumn = addressColumn + 1;
  var lngColumn = addressColumn + 2;
  
  var geocoder = Maps.newGeocoder().setRegion(getGeocodingRegion());
  var location;
  
  for (addressRow = 1; addressRow < lastRow; ++addressRow) {
    // Skip rows without latitude and rows that already have an address
    if(cells.getCell(addressRow, addressColumn+1).isBlank() || !cells.getCell(addressRow, addressColumn).isBlank()) {
      continue;
    }
    
    var lat = cells.getCell(addressRow, latColumn).getValue();
    var lng = cells.getCell(addressRow, lngColumn).getValue();
    
    // Geocode the lat, lng pair to an address.
    location = geocoder.reverseGeocode(lat, lng);
   
    // Only change cells if geocoder seems to have gotten a 
    // valid response.
    Logger.log(location.status);
    if (location.status == 'OK') {
      var address = location["results"][0]["formatted_address"];

      cells.getCell(addressRow, addressColumn).setValue(address);
    }
  }  
};


function generateMenu() {
  var setGeocodingRegionMenuItem = 'Set Geocoding Region (Currently: ' + getGeocodingRegion() + ')';
  
  var entries = [{
    name: "Geocode Selected Cells (Address to   Lat, Long)",
    functionName: "addressToPosition"
  }, {
    name: "Geocode Selected Cells (Address from Lat, Long)",
    functionName: "positionToAddress"
  }];
  
  return entries;
}

function updateMenu() {
  SpreadsheetApp.getActiveSpreadsheet().updateMenu('Geocode', generateMenu())
}

/**
 * Adds a custom menu to the active spreadsheet, containing a single menu item
 * for invoking the readRows() function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 *
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('Geocode', generateMenu());
};