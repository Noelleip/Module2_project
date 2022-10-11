async function prepareHeader() {
  let resRoute = await fetch("/route");
  let dataRoute = await resRoute.json();
  let routes = dataRoute.routes;
  let headerElem = document.querySelector("#header");

  let resAttraction = await fetch("/attraction");
  let dataAttraction = await resAttraction.json();
  attractions = dataAttraction.attractions;

  if (headerElem) {
    // headerElem.innerHTML
    let htmlString = `
    
    
    <div class="navbar">
    
        <div class="navbar-left">
            <div class="logo-container"><img src="./index_img/logo.png" class="logo" alt="logo"></div>
            <div class="name">CYCLING FRIENDS</div>
            <div class="container">a container</div>
    
        </div>
    
        <div class="navbar-right">

            <button class="drop-btn">Hot!
                <i class="fa fa-caret-down"></i>
                <div class="dropdown-content">
    
                <div class="row">
                    <div class="column-container">
                        <div class="column1-topic">
                            <a href="/search.html">Popular Routes</a>
                            <div class="routeDetails1">
                            <br><br><br>
        `;
    for (let route of routes) {
      htmlString += `<a href="/search.html?routeId=${route.id}">${route.name}</a>`;
    }

    htmlString += `    </div>
                        </div>
                        <div class="column2-topic">
                            <div class="attractions-title"><a href="search.html">Popular Attractions</a></div>
                            <div class="routeDetails2">
                            `;
    for (let attraction of attractions) {
      htmlString += `<a href="/search.html?attractionId=${attraction.id}">${attraction.name}</a>`;
    }

    htmlString += `</div>
                        </div>
                        <div class="nav-bar-images">
                        </div>
                    </div>
                </div>
        
       
            </div>
            </button>
            

            </div>
            </button>
    
            <span class='sign-in-wrapper'>

            <a href="/login.html" style='color: black'>Login</a>
                <a href="/register.html" style='color: black'>Register</a>

            </span>
    
            <span class='user-info-wrapper'>
                <div class='user-info-inner-wrapper'>
                    <span class='username'></span>
                    <span class='userimage'></span>
                    <span class='logout-btn'> Logout</span>
                </div>
            </span>
            <a href="/search.html" style='color: black'>Search</a>
        </div>
    `;
    headerElem.innerHTML = htmlString;
    document
      .querySelector(".logo-container")
      .addEventListener("click", (event) => {
        location.href = "./index.html";
      });
    getMe();
  }
}

async function getMe() {
  let res = await fetch("/user/me");
  if (res.ok) {
    let data = await res.json();
    let user = data.data.user;
    document.querySelector(".sign-in-wrapper").style.display = "none";
    let userInfoWrapper = document.querySelector(".user-info-wrapper");
    userInfoWrapper.querySelector(
      ".username"
    ).innerText = `Hello, ${user["username"]}! `;
    userInfoWrapper.querySelector(
      ".userimage"
    ).innerHTML = `<img src="/profile_img/${user["userimage"]}`;
    userInfoWrapper.style.display = "block";
    setLogoutEventlistener();
  }
}

function setLogoutEventlistener() {
  document
    .querySelector(".user-info-wrapper .logout-btn")
    .addEventListener("click", async (e) => {
      e.preventDefault();
      let res = await fetch("/user/logout");
      if (res.ok) {
        prepareHeader();
        alertify.success("Logout successfully");
      }
    });
}

prepareHeader();

// let routeContainer = document.querySelector('.column1-topic')
// async function generateRoutes() {
//     let res = await fetch('/route')
//     let data = await res.json()
//     // console.log(data.routes);
//     let routeArray = data.routes.sort(compare);
//     // console.log(routeArray);

//     function compare(a, b) {
//         if (a.popularity < b.popularity) {
//             return -1;
//         }
//         if (a.popularity > b.popularity) {
//             return 1;
//         }
//         return 0;
//     }

//     for (let i = 0; i < 4; i++) {
//         routeContainer.innerHTML += `
//         <div class="card-container col-md-3">
//         <div class="card">
//         <img src=${routeArray[i].image} class="card-img-top" alt="...">
//         <div class="card-body">
//             <h5 class="card-title">${routeArray[i].name}</h5>
//             <p class="card-text">${routeArray[i].description}</p>
//             <a href="/search.html?routeId=${routeArray[i].id}"
//                 class="btn btn-primary card-btn">See Route
//             </a>

//             <div class="stars-container spacing"><i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//             </div>
//             </div>
//             </div>
//             </div>

//         `
//     }

// }
