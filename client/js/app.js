let map;

const TAXIURL = 'http://localhost:3000/api/v1/taxi';
const BOOKINGURL = 'http://localhost:3000/api/v1/booking';

const PINKTAXI = 'https://user-images.githubusercontent.com/714508/93063483-f5a3ce80-f693-11ea-8a9d-c0f9a6764f35.png';
const NORMALTAXI = 'https://user-images.githubusercontent.com/714508/93065075-e6258500-f695-11ea-82a5-392292364ca4.png';

  let taxiMarker;

  let srcMarker;
  let destMarker;

  let taxiMarkers = {};

  function initMap() {
    const myLatlng = {lat: 12.9716, lng: 77.5946};
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 8,
      center: myLatlng
    });
    const taximap = new google.maps.Map(document.getElementById("taxi-map"), {
      zoom: 8,
      center: myLatlng
    });
    map.addListener("click", function(e) {
      placeMarkerAndPanTo(e.latLng, map);
    });
    taximap.addListener("click", function(e) {
      selectlocation(e.latLng, taximap);
    });
    google.maps.event.trigger(map, "resize");

    $.ajax({ 
        type: "GET",
        dataType: "json",
        url: TAXIURL,
        success: function(data){        
          // console.log(data);
          if (data && data.length > 0){
              $('#taxicount').text(data.length);
            let taxiHTML = '<ul class="list-unstyled">';
            $.each(data, function( index, taxi ) {
                console.log(taxi.location)
                let taxiIcon = NORMALTAXI;
                if (taxi.taxi_type === 'PINK'){
                    taxiIcon = PINKTAXI;
                }
                taxiHTML += '<li class="media">';
                taxiHTML += '<img src="'+ taxiIcon +'" class="mr-3" alt="...">';
                taxiHTML += '<div class="media-body">';
                taxiHTML += '<h5 class="mt-0 mb-1">';
                taxiHTML += taxi.driver.name + ' ('+ taxi.car.car_number + ')'
                taxiHTML += '</h5>';
                taxiHTML += '</div>';
                taxiHTML += '</li>';

                taxiMarkers[taxi.id] = new google.maps.Marker({
                    position: {lat: taxi.location.lat, lng: taxi.location.long},
                    icon: taxiIcon,
                    map: map
                });
            });
            taxiHTML += '</ul>';

            $('#avilableTaxi').html(taxiHTML)
          }
        }
     });

  }

  function placeMarkerAndPanTo(latLng, map) {
    // console.log(latLng.lat() , latLng.lng(), latLng.toJSON());
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      draggable:true,
    });
    // map.panTo(latLng);
  }


  function selectlocation(latLng, map) {
    if (taxiMarker){
      taxiMarker.setMap(null);
    }
    taxiLatLng = latLng;
    taxiMarker = new google.maps.Marker({
      position: latLng,
      map: map
    });
  }


  $( "#formtaxi" ).submit(function( event ) {
    let formVal = $( this ).serializeArray();
    if (formVal.length == 2 && taxiLatLng){
        let data = {};
        $.each(formVal, function( index, frmvalue ) {
            if (frmvalue.name === "driverName"){
                data['driver'] = {"name" : frmvalue.value};
            } else {
                data['car'] = {"car_number" : frmvalue.value};
            }
        });
        data['location'] = {
            "lat" : taxiMarker.getPosition().lat(),
            "long": taxiMarker.getPosition().lng()
        };
        $.ajax({
            contentType: 'application/json',
            type : 'POST',
            url : TAXIURL,
            data : JSON.stringify(data),
            dataType: 'json',
            error: function(xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                $("#errorMessage").text(err);
                $("#errorMessage").css("display", "block");
            },
            success: function () {
                taxiMarker.setMap(null);
                taxiLatLng = null;
                $('#formtaxi').trigger("reset");
                $("#successMessage").text("Successfully added the details");
                $("#successMessage").css("display", "block");
            }
        });
        
    } else {
        $("#errorMessage").text("Please provide all values");
        $("#errorMessage").css("display", "block");
    }
    event.preventDefault();
  });
  

  $('#exampleModal').on('hidden.bs.modal', function (e) {
    // do something...
    $("#errorMessage").css("display", "none");
    $("#successMessage").css("display", "none");
  })