let productDetailContainerElem = document.querySelector('#product-detail-container')
let productTitleElem = document.querySelector('.product-title')


async function fetchProductById(selecterProductId) {
    let res = await fetch(`/products/${selecterProductId}`)
    let data = await res.json()
    let productInfo = data.data
    document.title = productInfo.name
    productDetailContainerElem.innerHTML = JSON.stringify(productInfo)
    productTitleElem.innerText = productInfo.name
}

async function fetchSessionProduct() {
    let res = await fetch('/selected-product-info')
    let data = await res.json()
    let productInfo = data.data
    productDetailContainerElem.innerHTML = JSON.stringify(productInfo)
}
function getProductIdInQuery() {
    let search = new URLSearchParams(window.location.search)
    return search.get('productId')
}
async function initProductDetailPage() {
    let selecterProductId = getProductIdInQuery()
    fetchProductById(selecterProductId)
}

window.onload = initProductDetailPage
