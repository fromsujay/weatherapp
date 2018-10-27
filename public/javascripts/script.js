var map;

function initMap() {

// The map, centered at Paris
var centre = {lat: 48.866667, lng: 2.333333};
map = new google.maps.Map(document.getElementById('mapdiv'), {zoom: 10, center: centre});

var li = document.getElementsByTagName('li');

for(var i=0; i < document.getElementsByTagName('li').length; i++) {
  var marker = new google.maps.Marker({position: {
    lat: parseFloat(li[i].dataset.lat),
    lng: parseFloat(li[i].dataset.lon)
  },
  map: map});
}

}
