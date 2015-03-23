jQuery(document).ready(function(){
  GoogleMap = null;
  CurrentMarkers = [];
  function initialize(){
    //focus map in on Bangladesh:
    var mapOptions = { 
      center: new google.maps.LatLng(23.976215,-269.274902), zoom: 7,
      disableDefaultUI: true,
      zoomControl: true,
      panControl: true, //for panning and rotating when zoomed in.
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      overviewMapControl: true
    };
    var initialCenter = mapOptions.center;
    var initialZoom = mapOptions.zoom;
    var map = new google.maps.Map(document.getElementById("mapDiv"), mapOptions);
    addButtons(map);
    //addShowCoords(map);
    addGoToInitialExtent(map, initialCenter, initialZoom);
    drawMarkers(map, {
        lat: 23.846695,
        long: 90.403005,
        title: "Hazrat Shah Jalal Airport",
        content: [
            "<div id='content'>", 
            "<img src='http://t3.gstatic.com/images?q=tbn:ANd9GcRM7spbCyj3Jw5nf1vGgZzrdQZIoOgfnjlNxmd5RDmY5hzoTwgKsA' align='center'/> ",
            "<p> Dhaka\'s main airport, Hazrat Shah Jalal International </p>",
            "<p> Airport. This airport is named after the Sufi leader </p>",
            "<p> Shah Jalal. </p>",
            "</div>"
        ].join("")
    });
    //drawPolyline(map);
    // drawEditablePolygon(map);
    // drawDraggableRectangle(map);
    // drawCircle(map); 
    //addKmlLayer(map);
    GoogleMap = map;
  };
  function drawMarkers(map, data){
    var icon = data.icon || "http://www.delcad.com/wp-content/uploads/2013/03/favicon-small-twitter.png";
    var marker = new google.maps.Marker({
                  //23.846695,90.403005
      position: new google.maps.LatLng(data.lat, data.long),
      map: map,
      title: data.title,//"Hazrat Shah Jalal Airport",
      icon: icon
    });
              
              //"<div id='content'>" + "<img src='http://t3.gstatic.com/images?q=tbn:ANd9GcRM7spbCyj3Jw5nf1vGgZzrdQZIoOgfnjlNxmd5RDmY5hzoTwgKsA' align='center'/> " + "<p> Dhaka\'s main airport, Hazrat Shah Jalal International </p>" + "<p> Airport. This airport is named after the Sufi leader </p>" + "<p> Shah Jalal. </p>" + "</div>";
    //var contentString = data;
    var infowindow = new google.maps.InfoWindow({
      content: data.content
    });
    google.maps.event.addListener(marker, 'click', function(){
      infowindow.open(map, marker)
    });
    
    CurrentMarkers.push(marker);
  }
  // function addKmlLayer(map){
  //  var offasDykeLayer= new google.maps.KmlLayer('http://hikeview.co.uk/tracks/hikeview-offas-dyke.kml');
  //  offasDykeLayer.setMap(map);
  // }
  //example of adding in KML data:
  //var kmlLayer = new google.maps.KmlLayer(<URL>);
  //kmlLayer.setMap(map);
  //heatmap layer?
  function addButtons(map){
    //event handlers in standard JS - there is a google maps way to do this
    // document.getElementById('btnTerrain').addEventListener('click', function(){
    //  map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    // }); replacing with google maps method:
    
    google.maps.event.addDomListener(btnTerrain, 'click',
      function(){
        map.setMapTypeId(google.maps.MapTypeId.TERRAIN);
    })
    document.getElementById('btnHybrid').addEventListener('click', function(){
      map.setMapTypeId(google.maps.MapTypeId.HYBRID);
    });
    document.getElementById('btnRoadmap').addEventListener('click', function(){
      map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    });
    document.getElementById('btnSatellite').addEventListener('click', function(){
      map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    });
  }
  google.maps.event.addDomListener(window, "load", initialize);
  // function addShowCoords(map){
  //  google.maps.event.addListener(map, 'center_changed',
  //    function(){
  //      var newCenter = map.getCenter();
  //      var zoom = map.getZoom();
  //      document.getElementById('coordsDiv').innerHTML = "Center: " + newCenter.toString() + "<br>Zoom: " + zoom;
  //    });
  // }
  function addGoToInitialExtent(map, initialCenter, initialZoom){
    google.maps.event.addListener(map, "rightclick",
    function(){
    map.setCenter(initialCenter);
    map.setZoom(initialZoom);
    });
  }
  
  function showLoadingSpinner() {
      jQuery(".loading").fadeIn();
  }
  function hideLoadingSpinner() {
  jQuery(".loading").fadeOut(199);
  }
  
  var $term = jQuery('input[name="term"]');
  jQuery('form[name="twitter_search"]').on('submit', function (e) {
      e.preventDefault();
      var search = jQuery.ajax({
          method: 'GET',
          url: '/twitter/search',
          data: {term: $term.val()},
          // this is where req.query.term comes from
          //this is the client request
          dataType: 'json'
      });
      
      showLoadingSpinner();
      
      
        
       search.done(function(res) {
      hideLoadingSpinner();
      if (res.statuses.length <= 0) {
      setTimeout(function(){
          alert("No results found");
      }, 200);
      return;
    }
          
         
          
          mapStatuses(res.statuses);
      });
      
      search.error(function (err) {
          console.log(err);
      });
      
      function mapStatuses(statuses) {
          CurrentMarkers.forEach(function (marker) {
              marker.setMap(null);
              // we are getting rid of all the markers.  
            //https://developers.google.com/maps/documentation/javascript/markers
          });
          
          statuses.forEach(function(status) {
             if (!status.geo)
                 return;
            
             var profileUrl = "http://twitter.com/"+ status.user.screen_name;
             drawMarkers(GoogleMap, {
                 lat: status.geo.coordinates[0],
                 long: status.geo.coordinates[1],
                 title: status.text,
                 content: [
                     "<div>"+ status.text +"</div>",
                     "<a target='_blank' href='"+ profileUrl + "'>"+ status.user.name +"<a>"
                ].join("")
             });
          });
      }
  });
});