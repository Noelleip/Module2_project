// Initialize and add the map
export let flightPath;
export let map;
let pathArray = [];
// let pathOrder = 0;

function initMap() {
  // The location of Uluru
  const uluru = { lat: 22.28642675761758, lng: 114.14978583430094 };
  const uluru2 = { lat: 22.28585096796508, lng: 114.14853056056326 };
  const uluru3 = { lat: 22.287998356742815, lng: 114.14412707333595 };
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: uluru,
  });
  // The marker, positioned at Uluru
  const marker = new google.maps.Marker({
    position: uluru,
    map: map,
  });
  const marker2 = new google.maps.Marker({
    position: uluru2,
    map: map,
  });

  const flightPlanCoordinates = [
    { lat: 22.28657649691148, lng: 114.151886150335 },
    { lat: 22.28642675761758, lng: 114.14978583430094 },
    { lat: 22.288045718797413, lng: 114.14790751915643 },
    { lat: 22.287645023450523, lng: 114.14719479384064 },
    { lat: 22.287998356742815, lng: 114.14412707333595 },
    { lat: 22.285533006073102, lng: 114.14267485218826 },
  ];
  flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
  });

  //   flightPath.setMap(map);

  //   const uluru3 = { lat: -25.363, lng: 131.044 };
  //   const map = new google.maps.Map(document.getElementById("map"), {
  //     zoom: 4,
  //     center: uluru3,
  //   });
  const contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
    '<img class="attraction-image-google-map" src="./search_img/searchimage_NSW_01.jpg" alt=""></img>' +
    '<div id="bodyContent">' +
    "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
    "sandstone rock formation in the southern part of the " +
    "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
    "south west of the nearest large town, Alice Springs; 450&#160;km " +
    "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
    "features of the Uluru - Kata Tjuta National Park. Uluru is " +
    "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
    "Aboriginal people of the area. It has many springs, waterholes, " +
    "rock caves and ancient paintings. Uluru is listed as a World " +
    "Heritage Site.</p>" +
    '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
    "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
    "(last visited June 22, 2009).</p>" +
    "</div>" +
    "</div>";
  const infowindow = new google.maps.InfoWindow({
    content: contentString,
  });
  const marker3 = new google.maps.Marker({
    position: uluru3,
    map,
    title: "Uluru (Ayers Rock)",
  });

  marker3.addListener("click", () => {
    infowindow.open({
      anchor: marker3,
      map,
      shouldFocus: false,
    });
  });

  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  //   const map = new google.maps.Map(
  //     document.getElementById("map") as HTMLElement,
  //     {
  //       zoom: 7,
  //       center: { lat: 41.85, lng: -87.65 },
  //     }
  //   );

  directionsRenderer.setMap(map);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  // document.getElementById("start").addEventListener("change", onChangeHandler);
  // document.getElementById("end").addEventListener("change", onChangeHandler);

  ////////////////////////////////
  //Get center location
  ////////////////////////////////

  google.maps.event.addListener(map, "dragend", function () {
    // console.log("dragend");
    // console.log(map.getCenter().toUrlValue());
    let position = map.getCenter().toJSON()
    // position.order = pathOrder;
    // console.log(position);
    pathArray.push(position)
    console.log(pathArray);
    // pathOrder++
  });
}

window.initMap = initMap;

function deleteMarkers(markersArray) {
  for (let i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }

  markersArray = [];
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  directionsService
    .route({
      origin: {
        query: document.getElementById("start").value,
      },
      destination: {
        query: document.getElementById("end").value,
      },
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + e));

  //   console.log(
  //     document.getElementById("start").selectedOptions[0].textContent.trim()
  //   );
  //   console.log(
  //     document.getElementById("end").selectedOptions[0].textContent.trim()
  //   );

  if (
    document.getElementById("start").selectedOptions[0].textContent.trim() ===
    "Sai Ying Pun Station" &&
    document.getElementById("end").selectedOptions[0].textContent.trim() ===
    "Sheung Wan Station"
  ) {
    flightPath.setMap(map);
  }
}

////////////////////////////////
//Distance Matrix Service
////////////////////////////////

// document
//   .getElementById("distance-btn")
//   .addEventListener("click", calculateDistanceAndDisplayMarker);

function calculateDistanceAndDisplayMarker() {
  const bounds = new google.maps.LatLngBounds();
  const markersArray = [];
  const geocoder = new google.maps.Geocoder();
  const service = new google.maps.DistanceMatrixService();

  // build request
  const origin1 = { lat: 22.28785243443067, lng: 114.14080143505446 };
  //   const origin2 = "Greenwich, England";
  //   const destinationA = "Central Station, Hong Kong";
  const destinationA = { lat: 22.286875459945673, lng: 114.14342481211523 };
  const destinationB = { lat: 22.287998356742815, lng: 114.14412707333595 };

  const request = {
    origins: [origin1],
    destinations: [destinationA, destinationB],
    travelMode: google.maps.TravelMode.WALKING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  // put request on page
  document.getElementById("request").innerText = JSON.stringify(
    request,
    null,
    2
  );

  // get distance matrix response
  service.getDistanceMatrix(request).then((response) => {
    // put response
    document.getElementById("response").innerText = JSON.stringify(
      response,
      null,
      2
    );

    // show on map
    const originList = response.originAddresses;
    const destinationList = response.destinationAddresses;

    deleteMarkers(markersArray);

    const showGeocodedAddressOnMap = (asDestination) => {
      const handler = ({ results }) => {
        map.fitBounds(bounds.extend(results[0].geometry.location));
        markersArray.push(
          new google.maps.Marker({
            map,
            position: results[0].geometry.location,
            label: asDestination ? "Path Point" : "Me",
          })
        );
      };

      return handler;
    };

    for (let i = 0; i < originList.length; i++) {
      const results = response.rows[i].elements;

      geocoder
        .geocode({ address: originList[i] })
        .then(showGeocodedAddressOnMap(false));

      for (let j = 0; j < results.length; j++) {
        geocoder
          .geocode({ address: destinationList[j] })
          .then(showGeocodedAddressOnMap(true));
      }
    }
  });
}
