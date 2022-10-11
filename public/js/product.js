let productsContainerElem = document.querySelector('#product-container')
let imagePreffix = 'images/'




async function fetchProducts() {
    let res = await fetch('/products')
    let result = await res.json()
    let products = result.data
    console.table(products)

    for (let product of products) {
        imageName = product.image ? imagePreffix + product.image : imagePreffix + "questionMark.jpg"
        let productHTML = `
        
        <div class="col-sm-6 col-md-4 col-lg-3">
                  <div class="box">
                     <div class="option_container">
                        <div class="options">
                          <button onclick="fetchSelectedProductId(${product.id})" > Session Deatils </button>
                           <a href="product_detail.html?productId=${product.id}" class="option1">
                           Details
                           </a>
                           <a href="" class="option2">
                           Buy Now
                           </a>
                        </div>
                     </div>
                     <div class="img-box">
                     <img src=${imageName} alt="product to buy ">
                     </div>
                     <div class="detail-box">
                        <h5>
                        ${product.name}
                        </h5>
                        <h6>
                        ${product.price}
                        </h6>
                     </div>
                  </div>
               </div> 
               `
        productsContainerElem.innerHTML += productHTML
    }



}
function fetchSelectedProductId(selectedProductId) {
    console.log('fetchSelectedProductId called : ', selectedProductId);
    let res = fetch(`/select-product/${selectedProductId}`)
    if (res) {
        window.location = '/product_detail.html'
    }
}
function getImageTag(imageName) {
    let imageTag = ` <img src=${imagePreffix + imageName} alt="product to buy ">`
    return imageTag
}
function initProductPage() {
    fetchProducts()
}

initProductPage()

