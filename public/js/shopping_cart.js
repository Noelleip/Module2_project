async function fetchShoppingCart() {

    let res = await fetch('/shopping-cart')
    if (res.ok) {
        let data = await res.json()
        console.log('fetchShoppingCart data = ', data)
        return data
    }

}

function updateShoppingCartDOM(shoppingCartItems) {

    let headerHTML = `
    <div class="title">
                        <div class="row">
                            <div class="col">
                                <h4><b>Shopping Cart</b></h4>
                            </div>
                            <div class="col align-self-center text-right text-muted">${shoppingCartItems.length} items</div>
                        </div>
                    </div>`
    let cartHTMLs = ''
    for (let shoppingCartItem of shoppingCartItems) {

        cartHTMLs += `
    <div class="row border-top">
                        <div class="row main align-items-center">
                            <div class="col-2">
                                <img src='${shoppingCartItem.img}}'>
                            </div>
                            <div class="col">
                                <div class="row text-muted">${shoppingCartItem.category}</div>
                                <div class="row">${shoppingCartItem.name}</div>
                            </div>
                            <div class="col text-center">
                                ${shoppingCartItem.quantity}
                            </div>
                            <div class="col">&euro; ${shoppingCartItem.price} <span class="close">&#10005;</span></div>
                        </div>
                    </div>
    `

    }


    document.querySelector('.cart').innerHTML = ''
    document.querySelector('.cart').innerHTML = headerHTML + cartHTMLs

    // add border bottom for the last element
    let cartItemElems = document.querySelectorAll('.cart .border-top')
    cartItemElems[cartItemElems.length - 1].classList.add('border-bottom')

}

async function initShoppingCartPage() {
    // get all shopping cart items from server
    let shoppingCartItems = await fetchShoppingCart()
    // update dom by items
    updateShoppingCartDOM(shoppingCartItems)
}

// run initShoppingCartPage until page is fully loaded
window.onload = initShoppingCartPage