// let routeAttractionDropdown = document.querySelector('#route-attraction-dropdown')
// let attractionDropdown = document.querySelector("#attraction-dropdown");
// let attractionButton = document.querySelector('.attraction-button')
// let attractionFilterBlock = document.querySelector('.attraction-input-wrapper')
// let cardWrapper = document.querySelector('.card-input-wrapper')
// let routeDropdown = document.querySelector("#route-dropdown");
// let routeButton = document.querySelector('.route-button')
// let routeFilterBlock = document.querySelector('.route-input-wrapper')

// let routes = document.querySelector('.routes-container')

// let attractionContainer = document.querySelector('.landscape-bottom-container')
let routeContainer = document.querySelector('.detail-container')



async function generateRoutes() {
    let res = await fetch('/route')
    let data = await res.json()
    // console.log(data.routes);

    function compare(a, b) {
        if (a.popularity < b.popularity) {
            return -1;
        }
        if (a.popularity > b.popularity) {
            return 1;
        }
        return 0;
    }

    let routeArray = data.routes.sort(compare);

    // console.log(routeArray);

    for (let i = 0; i < 1; i++) {
        routeContainer.innerHTML += `

            <div class="card">
            <img src=${routeArray[i].image} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${routeArray[i].name}</h5>
                <p class="card-text">${routeArray[i].description}</p>
                <a href="#" class="btn btn-primary">See Route</a>
                <div class="stars-container spacing"><i class="bi bi-star"></i>
                    <i class="bi bi-star"></i>
                    <i class="bi bi-star"></i>
                    <i class="bi bi-star"></i>
                    <i class="bi bi-star"></i>
                </div>
            </div>
            </div>

       `
    }

}

// async function generateAttractions() {
//     let res = await fetch('/attraction')
//     let data = await res.json()
//     // console.log(data);
//     let cardsArray = data.attractions
//     // console.log(cardsArray);
//     for (let i = 0; i < 4; i++) {
//         attractionContainer.innerHTML += `

//         <div class="card">
//         <img src=${cardsArray[i].image} class="card-img-top" alt="...">
//         <div class="card-body">
//             <h5 class="card-title">${cardsArray[i].name}</h5>
//             <p class="card-text">${cardsArray[i].description}</p>
//             <a href="#" class="btn btn-primary">See Attraction</a>
//             <div class="stars-container spacing"><i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//                 <i class="bi bi-star"></i>
//             </div>
//             </div>
//             </div>

//    `
//     }


// }
generateRoutes()
// generateAttractions()

        // <option value="#">Sheung Wan Station</option>
        // <option value="#">Sai Ying Pun Station</option>
        // <option value="#">Central Station</option>

