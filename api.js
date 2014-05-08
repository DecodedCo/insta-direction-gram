var spinner = new Spinner().spin();
$(".spinner").append(spinner.el);
console.log(spinner.el.innerHTML)

navigator.geolocation.getCurrentPosition(makeRequest)

function makeRequest(pos){

  // Stop loading animation
  spinner.stop();

  var desired_destination = getURLParameter("destination");
  if (desired_destination == null) {
    alert("You need to add destination as a URL parameter!")
  }
  var apiURL = "proxy.php?location=" + pos.coords.latitude + "," + pos.coords.longitude + "&destination=" + desired_destination;
  $("#message").html("Your journey to " + desired_destination + "&hellip; via Instagram");
  var steps = [];

   // Get the google directions data
  $.ajax({
    url: apiURL,
    dataType: 'json',
    cache: false
  })
  // Store the steps (text, lat, long)
  .done(function(data ) {
    console.log( data.routes[0].legs[0].steps)
    $.each(data.routes[0].legs[0].steps, function (key, value){
      steps.push(  {
        lat: value.start_location.lat,
        lng: value.start_location.lng,
        txt: value.html_instructions,
        distance: value.distance.value
      })
    });

   createSteps(steps);
  });
}

function createSteps(steps){

  var cumulative_distance = 0;
  $.each(steps, function (key, value){

    console.log(steps.length )
    // If it is the first or last step, or 1000m has elapsed, show the images!
    if (key == 0 || key == steps.length - 1 || cumulative_distance > 1000) {
      // Set step number
      var step_number = "step" + key;
      // get place name, and create div
      $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: 'https://api.instagram.com/v1/locations/search?lat=' + value.lat + '&lng=' + value.lng + '&client_id=08d113c1743f4a558433754822a917bd',
        success: function(response) {
          var place_name = response.data[0].name;
          $( ".images" ).append( '<div class="step ' + step_number + '"><p>' + place_name + '</p></div>' );
        getImages(step_number, value.lat, value.lng)

        }
      })

      cumulative_distance = 0;

    } else {
      cumulative_distance += value.distance;
    }

  })
}
/*
* Function for getting recent images from Instagram
* It loads images onto the specified target
*/
function getImages(target, lat, lng){

  // AJAX call
  $.ajax({
    type: "GET",
    dataType: "jsonp",
    cache: false,
    url: 'https://api.instagram.com/v1/media/search?lat=' + lat + '&lng=' + lng + '&client_id=08d113c1743f4a558433754822a917bd',
    success: function(response) {

           // Loop through all the images
      $.each(response.data, function(index, value){
        if (index < 9){
          // Create an image tag
          var img = $('<img class="image_tag">');

          // Set the source of the image
          img.attr('src', value.images.thumbnail.url);

          // Add the image to the image area
          $("." + target).append(img);
        }

      })
    },
    error: function(request, errorType, errorMessage) {
      // Display error messages if there's a problem getting data from Instagram
      alert('Error:' + errorType + 'with message' + errorMessage);
    }
  });
}

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}
