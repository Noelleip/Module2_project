// let routeAttractionDropdown = document.querySelector('#route-attraction-dropdown')
let attractionDropdown = document.querySelector("#attraction-dropdown");
let attractionButton = document.querySelector('.attraction-button')
let attractionFilterBlock = document.querySelector('.attraction-input-wrapper')
// let cardWrapper = document.querySelector('.card-input-wrapper')
let routeDropdown = document.querySelector("#route-dropdown");
let routeButton = document.querySelector('.route-button')
let routeFilterBlock = document.querySelector('.route-input-wrapper')

let attractions = document.querySelector('.attractions-container')
let routes = document.querySelector('.routes-container')


attractionButton.addEventListener('click', (e) => {

    attractionWrapper.style.display = 'block';
    routeWrapper.style.display = 'none';
    cardWrapper.style.display = 'block';
    routeContainer.style.display = 'none';
})


routeButton.addEventListener('click', (e) => {
    attractionWrapper.style.display = 'none';
    routeWrapper.style.display = 'block';
    cardWrapper.style.display = 'none';
    routeContainer.style.display = 'block';
})

async function attractionDropdownGenerator() {
    let res = await fetch('/attraction')
    let data = await res.json()
    let attractionsArray = data.attractions
    for (let i = 0; i < attractionsArray.length; i++) {
        attractionDropdown.innerHTML += `<option>${attractionsArray[i].name}</option>`
    }
    //console tester
    attractionDropdown.addEventListener('click', (e) => {
        console.log('clicked')
        console.log(data.attractions)
        console.log(attractionsArray[0].name)
    })
}


async function routeDropdownGenerator() {
    let res = await fetch('/route')
    let data = await res.json()
    let routesArray = data.routes
    for (let i = 0; i < routesArray.length; i++) {
        routeDropdown.innerHTML += `<option>${routesArray[i].name}</option>`
    }
    //console tester
    routeDropdown.addEventListener('click', (e) => {
        console.log('clicked')
        console.log(data.routes)
        console.log(routesArray[0].name)

    })
}

async function generateAttractions() {
    let res = await fetch('/attraction')
    let data = await res.json()
    let cardsArray = data.attractions
    //     for (let i = 0; i < cardsArray.length; i++) {
    //         cardContainer.innerHTML += `

    //         <div class="card">
    //         <img src=${cardsArray[i].image} class="card-img-top" alt="...">
    //         <div><i class="bi bi-star-fill corner-star"></i></div>
    //         <div class="card-body">
    //             <h5 class="card-title">${cardsArray[i].name}</h5>
    //             <p class="card-text">${cardsArray[i].description}</p>
    //             <a href="#" class="btn btn-primary">See on map</a>
    //             <a href="#" class="btn btn-primary">See Route</a>
    //             <div class="stars-container spacing"><i class="bi bi-star"></i>
    //                 <i class="bi bi-star"></i>
    //                 <i class="bi bi-star"></i>
    //                 <i class="bi bi-star"></i>
    //                 <i class="bi bi-star"></i>
    //             </div>
    //             </div>

    //    `
    //     }
    attractions.addEventListener('click', (e) => {
        console.log(data.attractions)
    })

}
attractionDropdownGenerator()
routeDropdownGenerator()
generateAttractions()

        // <option value="#">Sheung Wan Station</option>
        // <option value="#">Sai Ying Pun Station</option>
        // <option value="#">Central Station</option>

