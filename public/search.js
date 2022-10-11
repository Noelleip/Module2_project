import {
  map,
  directionsService,
  markersAttractionArray,
  infoWindowsAttractionArray,
  displayAttractionMarkers,
  markersStationArray,
  infoWindowsStationArray,
  displayStationMarkers,
  deleteAttractionMarkers,
  deleteAttractionInfoWindows,
  deleteStationMarkers,
  deleteStationInfoWindows,
  routeRendererArray,
  deleteRoutes,
  previousAttractionInfoWindow,
  previousStationInfoWindow,
} from "./google_map.js";

// import { loginForm } from "./login.js"

///// Init
let filterAllAttractions = true;
let attractions;
let routes;
let userData;
let params = new URLSearchParams(window.location.search);
let routeId = params.get("routeId") ? params.get("routeId") : null;
let attractionId = params.get("attractionId")
  ? params.get("attractionId")
  : null;
async function init() {
  checkLoggedIn();
  await routeDropdownGenerate();
  if (!routeId && !attractionId) {
    generateCards(filterAllAttractions);
  } // generateCards(false, routeId);
  await attractionDropdownGenerate();
  // let startEndPoints = await findStartEnd(1)
  // calculateAndDisplayRoute(startEndPoints.startPoint[0].position, startEndPoints.endPoint[0].position)
}

///// Filter section

let filterTabs = document.querySelectorAll(".criteria-tab");
let dropdowns = document.querySelectorAll(".dropdown-area");
let resultTitle = document.querySelector(".result-title");
let routeButton = document.querySelector(".this-route-button");

for (let filterTab of filterTabs) {
  filterTab.addEventListener("click", async () => {
    for (let filterTab of filterTabs) {
      filterTab.classList.toggle("tab-active");
    }
    for (let dropdown of dropdowns) {
      dropdown.classList.toggle("dropdown-active");
      routeDropdown.selectedIndex = 0;
      attractionDropdown.selectedIndex = 0;
    }
    if (filterAllAttractions) {
      generateCards((filterAllAttractions = false));
    } else {
      generateCards((filterAllAttractions = true));
    }
    if (resultTitle.textContent === "沿途景點") {
      resultTitle.textContent = "建議路徑";
    } else {
      resultTitle.textContent = "沿途景點";
    }
    resetMapAndSelectedRouteButton();
    // deleteRoutes(routeRendererArray);
    // deleteAttractionMarkers(markersAttractionArray);
    // deleteAttractionInfoWindows(infoWindowsAttractionArray);
    // deleteStationMarkers(markersStationArray);
    // deleteStationInfoWindows(infoWindowsStationArray);
    // routeButton.classList.remove("route-button-display");
  });
}

export let routeDropdown = document.querySelector("#route-dropdown");

async function routeDropdownGenerate() {
  let res = await fetch("/route");
  let data = await res.json();
  let routesArray = data.routes;
  for (let i = 0; i < routesArray.length; i++) {
    routeDropdown.innerHTML += `<option value="${routesArray[i].id}">${routesArray[i].name}</option>`;
  }
}

export let attractionDropdown = document.querySelector("#attraction-dropdown");

async function attractionDropdownGenerate() {
  let res = await fetch("/attraction");
  let data = await res.json();
  let attractionsArray = data.attractions;
  for (let i = 0; i < attractionsArray.length; i++) {
    attractionDropdown.innerHTML += `<option value="${attractionsArray[i].id}">${attractionsArray[i].name}</option>`;
  }
}

attractionDropdown.addEventListener("change", async () => {
  if (attractionDropdown.value == "reset") {
    resetMapAndSelectedRouteButton();
    generateCards((filterAllAttractions = false), null, null);
  } else {
    let attractionId = attractionDropdown.value;
    //   console.log(attractionDropdown.selectedIndex);
    //   let text = routeDropdown.options[routeDropdown.selectedIndex].text;
    await generateCards(false, null, attractionId);
    showAttractionDetails(attractionId);
  }
});

routeDropdown.addEventListener("change", async () => {
  console.log("routeDropdown.value:", routeDropdown.value);
  console.log("routeDropdown.selectedIndex:", routeDropdown.selectedIndex);
  if (routeDropdown.value == "reset") {
    resetMapAndSelectedRouteButton();
    generateCards((filterAllAttractions = true), null, null);
  } else {
    let routeId = routeDropdown.value;
    routeButton.classList.add("route-button-display");
    routeButton.href = `/detail.html?routeId=${routeId}`;
    generateCards(false, routeId, null);
    deleteRoutes(routeRendererArray);
    let startEndPoints = await findStartEnd(routeId);
    displayRoute(
      startEndPoints.startPoint[0].position,
      startEndPoints.endPoint[0].position
    );
    displayAttractionMarkers(attractions);
    let stations = [startEndPoints.startPoint[0], startEndPoints.endPoint[0]];
    displayStationMarkers(stations);
  }
});

let cards = document.querySelector(".card-container");

async function generateCards(
  filterAllAttractions = false,
  routeId,
  attractionId,
  liked_attractions,
  liked_routes
) {
  // console.log("generateCards-filterAllAttractions :", filterAllAttractions);
  // console.log("generateCards-routeId :", routeId);
  // console.log("generateCards-attractionId :", attractionId);
  let res;
  attractions = null;
  routes = null;
  if (routeId) {
    res = await fetch(`/route/${routeId}/attractions`);
    let data = await res.json();
    attractions = data.attractions;
  } else if (attractionId) {
    res = await fetch(`/attraction/${attractionId}/routes`);
    let data = await res.json();
    routes = data.routes;
  } else if (liked_attractions) {
    attractions = liked_attractions;
  } else if (liked_routes) {
    routes = liked_routes;
  } else if (filterAllAttractions) {
    res = await fetch("/attraction");
    let data = await res.json();
    attractions = data.attractions;
  } else if (!filterAllAttractions) {
    res = await fetch(`/route`);
    let data = await res.json();
    routes = data.routes;
  }
  cards.innerHTML = "";
  // console.log(attractions);
  if (attractions) {
    for (let attraction of attractions) {
      cards.innerHTML += `
        <div class="card">
            <img
            class="card-img-top"
            src="${attraction.image}"
            alt="Card image cap"
            />
            <div>
            <i class="bi bi-star-fill corner-star ${
              userData && attraction.liked_user_id == userData.userId
                ? "liked"
                : ""
            }" id="attractionSave-${attraction.id}"></i>
            </div>
            <div class="card-body">
            <h5 class="card-title">${attraction.name}</h5>
            <p class="card-text">
                ${attraction.description}
            </p>
            <a href="#" class="btn btn-primary card-btn" id="attractionDetails-${
              attraction.id
            }">景點資訊</a>
            <div class="stars-container">
                <i class="bi bi-star ${
                  attraction.star >= 1 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  attraction.star >= 2 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  attraction.star >= 3 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  attraction.star >= 4 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  attraction.star >= 5 ? "star-show" : ""
                }"></i>
            </div>
            </div>
        </div>
       `;
    }
  } else if (routes) {
    for (let route of routes) {
      cards.innerHTML += `
        <div class="card card-attraction">
            <img
            class="card-img-top"
            src="${route.image}"
            alt="Card image cap"
            />
            <div>
            <i class="bi bi-star-fill corner-star ${
              userData && route.liked_user_id == userData.userId ? "liked" : ""
            }" id="routeSave-${route.id}"></i>
            </div>
            <div class="card-body">
            <h5 class="card-title">${route.name}</h5>
            <p class="card-text">
                ${route.description}
            </p>
            <a href="/detail.html?routeId=${
              route.id
            }" class="btn btn-primary card-btn">路徑資訊</a>
            <div class="stars-container">
                <i class="bi bi-star ${
                  route.popularity >= 1 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  route.popularity >= 2 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  route.popularity >= 3 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  route.popularity >= 4 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  route.popularity >= 5 ? "star-show" : ""
                }"></i>
            </div>
            </div>
        </div>
       `;
    }
  }
}

function resetMapAndSelectedRouteButton() {
  routeButton.classList.remove("route-button-display");
  routeButton.href = "#";
  deleteRoutes(routeRendererArray);
  deleteAttractionMarkers(markersAttractionArray);
  deleteAttractionInfoWindows(infoWindowsAttractionArray);
  deleteStationMarkers(markersStationArray);
  deleteStationInfoWindows(infoWindowsStationArray);
}

///// Map Interactions

async function showAttractionDetails(attractionId) {
  deleteRoutes(routeRendererArray);
  let stations = [];
  let attractions;
  for (let route of routes) {
    let startEndPoints = await findStartEnd(route.id);
    displayRoute(
      startEndPoints.startPoint[0].position,
      startEndPoints.endPoint[0].position
    );
    stations.push(startEndPoints.startPoint[0], startEndPoints.endPoint[0]);
    let routeAttractions = await getAttractionsByRouteId(route.id);
    if (attractions) {
      attractions = [...attractions, ...routeAttractions];
    } else {
      attractions = [...routeAttractions];
    }
  }
  displayStationMarkers(stations);
  // let selectedAttraction = await getAttraction(attractionId);
  // displayAttractionMarkers([selectedAttraction]);
  displayAttractionMarkers(attractions);
  openAttractionInfoWindow(attractionId);
}

export async function findStartEnd(routeId) {
  try {
    if (routeId) {
      let res = await fetch(`/route/${routeId}/start_end`);
      let data = await res.json();
      return data;
    } else {
      let selectedRouteId = routeDropdown.selectedOptions[0].value;
      let res = await fetch(`/route/${selectedRouteId}/start_end`);
      let data = await res.json();
      return data;
    }
  } catch (err) {
    console.log(err);
  }
}

function displayRoute(startPoint, endPoint) {
  let startPointString = `${startPoint.x},
  ${startPoint.y}`;
  let endPointString = `${endPoint.x},
  ${endPoint.y}`;
  let directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true,
  });
  directionsService
    .route({
      origin: {
        query: startPointString,
      },
      destination: {
        query: endPointString,
      },
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((err) => window.alert("Directions request failed due to " + err));
  routeRendererArray.push(directionsRenderer);
}

async function getAttraction(attractionId) {
  let res = await fetch(`/attraction/${attractionId}`);
  let data = await res.json();
  return data.attraction;
}
async function getAttractionsByRouteId(routeId) {
  let res = await await fetch(`/route/${routeId}/attractions`);
  let data = await res.json();
  return data.attractions;
}

function openAttractionInfoWindow(attractionId) {
  if (previousInfoWindow) {
    previousInfoWindow.close();
  }
  let infoWindow = infoWindowsAttractionArray.find(
    (infoWindow) => infoWindow.attractionId == attractionId
  );
  infoWindow.open({
    anchor: markersAttractionArray.find(
      (marker) => marker.attractionId == attractionId
    ),
    map,
    shouldFocus: true,
  });
  previousInfoWindow = infoWindow;
}

export let previousInfoWindow;
document.addEventListener("click", async function (event) {
  if (event.target && event.target.id.split("-")[0] == "attractionDetails") {
    let attractionId = event.target.id.split("-")[1];
    if (infoWindowsAttractionArray.length > 0) {
      for (let infoWindow of infoWindowsAttractionArray) {
        if (attractionId == infoWindow.attractionId) {
          // console.log(previousAttractionInfoWindow);
          // console.log(previousInfoWindow);
          if (previousAttractionInfoWindow) {
            previousAttractionInfoWindow.close();
          }
          if (previousStationInfoWindow) {
            previousStationInfoWindow.close();
          }
          if (previousInfoWindow) {
            previousInfoWindow.close();
          }
          infoWindow.open({
            anchor: markersAttractionArray.find(
              (marker) => marker.attractionId == infoWindow.attractionId
            ),
            map,
            shouldFocus: true,
          });
          previousInfoWindow = infoWindow;
          // previousAttractionInfoWindow = infoWindow;
        }
      }
    } else {
      let res = await fetch(`/attraction/${attractionId}/routes`);
      let data = await res.json();
      routes = data.routes;
      showAttractionDetails(attractionId);
    }
  } else if (
    event.target &&
    event.target.id.split("-")[0] == "attractionSave"
  ) {
    let res = await fetch("/user/me");
    let data = await res.json();
    if (res.status == 403) {
      modal.style.display = "block";
      modal.classList.add("show");
    } else if (res.status == 200) {
      userData = data.data.user;
      console.log(userData);
      let attractionId = event.target.id.split("-")[1];
      console.log(attractionId);
      let attraction = {
        attractionId: attractionId,
      };
      // console.log(countObject);
      const res = await fetch("/attraction/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(attraction),
      });
      if (res.status == 200) {
        if (routeDropdown.value == "reset") {
          generateCards(true, null, null);
        } else if (routeDropdown.value !== "reset") {
          generateCards(false, routeDropdown.value, null);
        }
      }
    }
  } else if (event.target && event.target.id.split("-")[0] == "routeSave") {
    let res = await fetch("/user/me");
    let data = await res.json();
    if (res.status == 403) {
      modal.style.display = "block";
      modal.classList.add("show");
    } else if (res.status == 200) {
      userData = data.data.user;
      console.log(userData);
      let routeId = event.target.id.split("-")[1];
      console.log(routeId);
      let route = {
        routeId: routeId,
      };
      // console.log(countObject);
      const res = await fetch("/route/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(route),
      });
      if (res.status == 200) {
        if (attractionDropdown.value == "reset") {
          generateCards((filterAllAttractions = false), null, null);
        } else if (attractionDropdown.value !== "reset") {
          generateCards(false, null, attractionDropdown.value);
        }
      }
    }
  }
});

////////////////////////////////
// Login and saving items
////////////////////////////////

async function checkLoggedIn() {
  let res = await fetch("/user/me");
  if (res.status == 200) {
    let data = await res.json();
    userData = data.data.user;
    logoutButton.style.display = "block";
    console.log(userData);
  }
}

let modal = document.querySelector(".modal");
let savedButton = document.querySelector(".saved-button");
savedButton.addEventListener("click", async () => {
  let res = await fetch("/user/me");
  if (res.status == 403) {
    modal.style.display = "block";
    modal.classList.add("show");
  } else if (res.status == 200) {
    let data = await res.json();
    userData = data.data.user;
    // console.log(userData);
    savedButton.classList.toggle("saveButton-active");
    let activeTab = document.querySelector(".tab-active").innerText;
    if (savedButton.classList.contains("saveButton-active")) {
      if (activeTab == "路徑") {
        let resAttractions = await fetch(
          `/user/${userData.userId}/liked_attractions`
        );
        let dataAttractions = await resAttractions.json();
        // console.log(dataAttractions);
        generateCards(false, null, null, dataAttractions.attractions);
      } else if (activeTab == "景點") {
        let resRoutes = await fetch(`/user/${userData.userId}/liked_routes`);
        let dataRoutes = await resRoutes.json();
        // console.log(dataRoutes);
        generateCards(false, null, null, null, dataRoutes.routes);
      }
    } else {
      // console.log("routeDropdown.value:", routeDropdown.value);
      // console.log("attractionDropdown.value:", attractionDropdown.value);
      // console.log(activeTab);
      if (activeTab == "路徑") {
        if (routeDropdown.value == "reset") {
          generateCards((filterAllAttractions = true), null, null);
        } else {
          generateCards(false, routeDropdown.value, null);
        }
      } else if (activeTab == "景點") {
        if (attractionDropdown.value == "reset") {
          generateCards((filterAllAttractions = false), null, null);
        } else {
          generateCards(false, null, attractionDropdown.value);
        }
      }
    }
  }
});

let closeBtn = document.querySelector(".btn-close");
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modal.classList.remove("show");
  // modal.className = "modal fade";
});

let loginArea = document.querySelector(".all-login-container");
let registerArea = document.querySelector(".all-register-container");
let loginTitle = document.querySelector(".modal-title");
let inputs = document.querySelectorAll("input");
let logoutButton = document.querySelector(".log-out-button");

let modalButtons = document.querySelectorAll(".modal-button");
for (let modalButton of modalButtons) {
  modalButton.addEventListener("click", (e) => {
    let btn = e.target;
    if (btn.value == "登入") {
      loginTitle.innerText = "登入";
      loginArea.style.display = "block";
      registerArea.style.display = "none";
    } else {
      loginTitle.innerText = "註冊";
      loginArea.style.display = "none";
      registerArea.style.display = "block";
    }
    // loginArea.classList.toggle("modal-active");
    // loginArea.style.display = "none";
    // registerArea.classList.toggle("modal-active");
  });
}

const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);
  // console.log(formData)
  const res = await fetch("/user/login", {
    method: "POST",
    body: formData,
  });
  if (res.ok) {
    let data = await res.json();
    userData = data.data.user;
    console.log(userData);
    alertify.set("notifier", "delay", 1.5);
    let successAlert = alertify.success("登入成功");
    successAlert.callback = function () {
      for (let i = 0; i < 6; i++) {
        inputs[i].value = "";
      }
      modal.style.display = "none";
      modal.classList.remove("show");
      logoutButton.style.display = "block";
      let activeTab = document.querySelector(".tab-active").innerText;
      if (activeTab == "路徑") {
        if (routeDropdown.value == "reset") {
          generateCards((filterAllAttractions = true), null, null);
        } else {
          generateCards(false, routeDropdown.value, null);
        }
      } else if (activeTab == "景點") {
        if (attractionDropdown.value == "reset") {
          generateCards((filterAllAttractions = false), null, null);
        } else {
          generateCards(false, null, attractionDropdown.value);
        }
      }
    };
  } else {
    alertify.error("Login fail");
  }
});

const registerForm = document.querySelector("#register-form");
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(registerForm);
  const res = await fetch("/user/register", {
    method: "POST",
    body: formData,
  });

  if (res.ok) {
    let data = await res.json();
    userData = data.data.user;
    console.log(userData);
    alertify.set("notifier", "delay", 1.5);
    let successAlert = alertify.success("註冊成功");
    successAlert.callback = function () {
      for (let i = 0; i < 6; i++) {
        inputs[i].value = "";
      }
      modal.style.display = "none";
      modal.classList.remove("show");
      logoutButton.style.display = "block";
    };
  } else {
    alertify.error("Register fail");
  }
});

logoutButton.addEventListener("click", async () => {
  let res = await fetch("/user/logout");
  if (res.ok) {
    alertify.set("notifier", "delay", 1.5);
    let warningAlert = alertify.warning("已登出");
    warningAlert.callback = function () {
      logoutButton.style.display = "none";
      userData = null;
      let activeTab = document.querySelector(".tab-active").innerText;
      if (activeTab == "路徑") {
        if (routeDropdown.value == "reset") {
          generateCards((filterAllAttractions = true), null, null);
        } else {
          generateCards(false, routeDropdown.value, null);
        }
      } else if (activeTab == "景點") {
        if (attractionDropdown.value == "reset") {
          generateCards((filterAllAttractions = false), null, null);
        } else {
          generateCards(false, null, attractionDropdown.value);
        }
      }
    };
  }
});

init().then(async () => {
  if (routeId) {
    routeDropdown.selectedIndex = routeId;
    routeButton.classList.add("route-button-display");
    routeButton.href = `/detail.html?routeId=${routeId}`;
    generateCards(false, routeId, null);
    deleteRoutes(routeRendererArray);
    let startEndPoints = await findStartEnd(routeId);
    displayRoute(
      startEndPoints.startPoint[0].position,
      startEndPoints.endPoint[0].position
    );
    displayAttractionMarkers(attractions);
    let stations = [startEndPoints.startPoint[0], startEndPoints.endPoint[0]];
    displayStationMarkers(stations);
  }
  if (attractionId) {
    for (let filterTab of filterTabs) {
      filterTab.classList.toggle("tab-active");
    }
    for (let dropdown of dropdowns) {
      dropdown.classList.toggle("dropdown-active");
      routeDropdown.selectedIndex = 0;
      attractionDropdown.selectedIndex = 0;
    }
    if (filterAllAttractions) {
      filterAllAttractions = false;
    } else {
      filterAllAttractions = true;
    }
    attractionDropdown.selectedIndex = attractionId;
    if (resultTitle.textContent === "沿途景點") {
      resultTitle.textContent = "建議路徑";
    } else {
      resultTitle.textContent = "沿途景點";
    }
    await generateCards(false, null, attractionId);
    showAttractionDetails(attractionId);
  }
});
