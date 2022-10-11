export let flightPath;
export let map;
export let directionsService;
// export let directionsRenderer;
// export let bounds;
import { previousInfoWindow } from "./search.js";
let pathArray = [];
let initPosition = { lat: 22.422065362474868, lng: 113.98532080154153 };

//// InitMapData

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: initPosition,
  });

  directionsService = new google.maps.DirectionsService();
  //   directionsRenderer = new google.maps.DirectionsRenderer();
  // bounds = new google.maps.LatLngBounds();
  //   directionsRenderer.setMap(map);
  //   previousAttractionInfoWindow = new google.maps.InfoWindow();
  //   console.log(previousInfoWindow);
}
window.initMap = initMap;

export let markersAttractionArray = [];
export let infoWindowsAttractionArray = [];
export let previousAttractionInfoWindow;
export function displayAttractionMarkers(attractions) {
  deleteAttractionMarkers(markersAttractionArray);
  deleteAttractionInfoWindows(infoWindowsAttractionArray);
  for (let attraction of attractions) {
    let attractionPoint = {
      lat: attraction.position.x,
      lng: attraction.position.y,
    };

    let contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      `<h5 id="firstHeading" class="google-map-heading">${attraction.name}</h5>` +
      `<img class="attraction-image-google-map" src="./attractions_img/${attraction.image}" alt=""></img>` +
      '<div id="bodyContent">' +
      `<div class="google-map-attraction-description">${attraction.description}</div>` +
      "</div>" +
      "</div>";
    let infoWindow = new google.maps.InfoWindow({
      content: contentString,
      attractionId: attraction.id,
    });

    let marker = new google.maps.Marker({
      map,
      position: attractionPoint,
      title: attraction.name,
      attractionId: attraction.id,
      // label: asDestination ? "Path Point" : "Me",
    });

    marker.addListener("click", () => {
      if (previousInfoWindow) {
        previousInfoWindow.close();
      }
      if (previousStationInfoWindow) {
        previousStationInfoWindow.close();
      }
      if (previousAttractionInfoWindow) {
        previousAttractionInfoWindow.close();
      }
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: true,
      });
      previousAttractionInfoWindow = infoWindow;
    });
    infoWindowsAttractionArray.push(infoWindow);
    markersAttractionArray.push(marker);
  }
}

export let markersStationArray = [];
export let infoWindowsStationArray = [];
export let previousStationInfoWindow;
export function displayStationMarkers(stations) {
  deleteStationMarkers(markersStationArray);
  deleteStationInfoWindows(infoWindowsStationArray);
  for (let station of stations) {
    let stationPoint = {
      lat: station.position.x,
      lng: station.position.y,
    };

    let contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      `<h5 id="firstHeading" class="google-map-heading">${station.name}</h5>` +
      `<img class="attraction-image-google-map" src="./stations_img/${station.image}" alt=""></img>` +
      '<div id="bodyContent">' +
      // `<div class="google-map-attraction-description">${station.description}</div>` +
      "</div>" +
      "</div>";
    let infoWindow = new google.maps.InfoWindow({
      content: contentString,
      stationId: station.id,
    });

    let marker = new google.maps.Marker({
      map,
      position: stationPoint,
      //   title: station.district,
      stationId: station.id,
      label: {
        text: station.district,
        fontSize: "20px",
        fontWeight: "bold",
        // fontFamily: "Helvetica",
      },
      icon: "./search_img/yellow_icon.png",
    });

    marker.addListener("click", () => {
      if (previousInfoWindow) {
        previousInfoWindow.close();
      }
      if (previousAttractionInfoWindow) {
        previousAttractionInfoWindow.close();
      }
      if (previousStationInfoWindow) {
        previousStationInfoWindow.close();
      }
      infoWindow.open({
        anchor: marker,
        map,
        shouldFocus: true,
      });
      previousStationInfoWindow = infoWindow;
    });
    infoWindowsStationArray.push(infoWindow);
    markersStationArray.push(marker);
  }
}

export function deleteAttractionMarkers(markersAttraction) {
  for (let i = 0; i < markersAttraction.length; i++) {
    markersAttraction[i].setMap(null);
  }
  markersAttractionArray = [];
}

export function deleteAttractionInfoWindows(infoWindowsAttraction) {
  for (let i = 0; i < infoWindowsAttraction.length; i++) {
    infoWindowsAttraction[i].setMap(null);
  }
  infoWindowsAttractionArray = [];
}

export function deleteStationMarkers(markersStation) {
  for (let i = 0; i < markersStation.length; i++) {
    markersStation[i].setMap(null);
  }
  markersStationArray = [];
}

export function deleteStationInfoWindows(infoWindowsStation) {
  for (let i = 0; i < infoWindowsStation.length; i++) {
    infoWindowsStation[i].setMap(null);
  }
  infoWindowsStationArray = [];
}

export let routeRendererArray = [];
export function deleteRoutes(routeRenderer) {
  for (let i = 0; i < routeRenderer.length; i++) {
    routeRenderer[i].setMap(null);
  }
  routeRendererArray = [];
}
