let attractionDropdown = document.querySelector("#attraction-dropdown");
let attractionButton = document.querySelector(".attraction-button");
let attractionFilterBlock = document.querySelector(".attraction-input-wrapper");
// let cardWrapper = document.querySelector('.card-input-wrapper')
let routeDropdown = document.querySelector("#route-dropdown");
let routeButton = document.querySelector(".route-button");
let routeFilterBlock = document.querySelector(".route-input-wrapper");

let routes = document.querySelector(".routes-container");

let attractionContainer = document.querySelector(".landscape-bottom-container");
let routeContainer = document.querySelector(".MPR-bottom-container");
let randomCommented = document.querySelector(".testimonials-bottom-container");

async function generateRoutes() {
  let res = await fetch("/route");
  let data = await res.json();
  // console.log(data.routes);
  let routeArray = data.routes.sort(compare);
  // console.log(routeArray);

  function compare(a, b) {
    if (a.popularity < b.popularity) {
      return -1;
    }
    if (a.popularity > b.popularity) {
      return 1;
    }
    return 0;
  }

  for (let i = 0; i < 4; i++) {
    routeContainer.innerHTML += `
        <div class="card-container col-md-3">
        <div class="card">
        <img src=${routeArray[i].image} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${routeArray[i].name}</h5>
            <p class="card-text">${routeArray[i].description}</p>
            <a href="/search.html?routeId=${routeArray[i].id}" 
                class="btn btn-primary card-btn">See Route
            </a>

            <div class="stars-container spacing">
                <i class="bi bi-star ${
                  routeArray[i].popularity >= 1 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  routeArray[i].popularity >= 2 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  routeArray[i].popularity >= 3 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  routeArray[i].popularity >= 4 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  routeArray[i].popularity >= 5 ? "star-show" : ""
                }"></i>
            </div>
            </div>
            </div>
            </div>

        `;
  }
}

async function generateAttractions() {
  let res = await fetch("/attraction");
  let data = await res.json();
  // console.log(data);
  let cardsArray = data.attractions;
  // console.log(cardsArray);
  attractionContainer.innerHTML += `
    <div class="row">
    `;
  for (let i = 0; i < 4; i++) {
    attractionContainer.innerHTML += `
        <div class="card-container col-md-3">
        <div class="cardrouteId">
        <img src=${cardsArray[i].image} class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${cardsArray[i].name}</h5>
            <p class="card-text">${cardsArray[i].description}</p>
            <a href="/search.html?attractionId=${cardsArray[i].id}" 
                class="btn btn-primary card-btn">See Attraction
            </a>

            <div class="stars-container spacing">
                <i class="bi bi-star ${
                  cardsArray[i].star >= 1 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  cardsArray[i].star >= 2 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  cardsArray[i].star >= 3 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  cardsArray[i].star >= 4 ? "star-show" : ""
                }"></i>
                <i class="bi bi-star ${
                  cardsArray[i].star >= 5 ? "star-show" : ""
                }"></i>
            </div>
            </div>
            </div>
            </div>
            
   `;
    attractionContainer.innerHTML += "</div>";
  }
}

async function randomCom() {
  // let res = await fetch(`/route_detail/${routeId}/comments`)
  let res = await fetch(`/route_detail/comments/random`);
  let data = await res.json();
  let comments = data.comments;
  let comments1 = data.comments[0];
  let comments2 = data.comments[1];

  // let number1 = Math.floor(Math.random() * comments.length);
  // let number2 = Math.floor(Math.random() * comments.length);

  let numberArray = [];
  numberArray.push(comments1);
  numberArray.push(comments2);

  for (let i = 0; i < numberArray.length; i++) {
    // console.log(numberArray[i]);
    // console.log(numberArray[i].username);

    /*html*/
    // commentedArea.innerHTML += `
    //     <div class="comment-box">
    //         <div class="comment-row-1">
    //             <div class="user-pic-container">
    //                 <img src="/profile_img/${comments[numberArray[i]].user_image
    //     }">
    //                 <div class="username">${comments[numberArray[i]].username
    //     }</div>
    //             </div>
    //             <div class="created-date">${comments[
    //         numberArray[i]
    //     ].created_at.slice(0, 10)}</div>
    //         </div>

    //         <div class="comment-row-2">
    //             <div class="comment-text">${comments[numberArray[i]].comment}
    //                 <img src="/routes_img/${comments[numberArray[i]].route_image
    //     }">
    //             </div>
    //             <div class="comment-routes-name">${comments[numberArray[i]].route_name
    //     }</div>
    //         </div>
    //     </div>`;
    randomCommented.innerHTML += `
        <div class="comment-box">
            <div class="comment-row-1">
                <div class="user-pic-container">
                    <img src="/profile_img/${numberArray[i].user_image}">
                    <div class="username">${numberArray[i].username}</div>
                </div>
                <div class="created-date">${numberArray[i].created_at.slice(
                  0,
                  10
                )}</div>
            </div>
        
            <div class="comment-row-2">
                <div class="comment-text">${numberArray[i].comment}
                    <img src="/routes_img/${numberArray[i].route_image}">
                </div>
                <div class="comment-routes-name">${
                  numberArray[i].route_name
                }</div> 
            </div>
        </div>`;

    randomCommented.addEventListener("click", (e) => {
      console.log(comments[0].image);
    });
  }
}

generateRoutes();
generateAttractions();
// comment();
randomCom();
