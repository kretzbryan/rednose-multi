let map;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

$(document).ready(() => {
    const $loginError = $.trim( $('#login-error').text() );

    if( $loginError !== '' ) {
      $('#loginModal').modal('show');
    }

    const $registerError = $.trim( $('#register-error').text() );

    if( $registerError !== '' ) {
      $('#registerModal').modal('show');
    }
})