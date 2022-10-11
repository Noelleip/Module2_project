window.onload = loadPage
const courseContainer = document.querySelector('#course-container')

async function loadPage(e) {
    await getProducts()
}

async function getProducts(category_id = "") {
    console.log(category_id)
    let url = (category_id) => {
        if (category_id !== "") {
            console.log('2', category_id)
            return `/category/${category_id}/products`
        }
        return `/products`
    }


    const res = await fetch(url(category_id))
    const result = await res.json()
    if (res.ok) {
        const rows = result.data
        let html = `<div class="product-container">`
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i]
            html += `<div class="products">`
            html += `<img src="${row.image}"
                class="course_picture" alt="demo_course_picture">`
            html += `<div class="course_details">Yoga is a group of physical, mental, and spiritual practices or
                disciplines which originated in ancient India and aim to control (yoke) and still the
                mind, recognizing a detached witness-consciousness untouched by the mind (Chitta) and
                mundane suffering (Duḥkha). There is a wide variety of schools of yoga, practices, and
                goals in Hinduism, Buddhism, and Jainism, and traditional and</div>
                <a href="each_course_details_Yoga.html?course_id=${row.id}">`
            html += `<div class="find_out_more">Find Out More</div></a>`
            html += `</div>`
            console.log(row)
            // console.log(html)
        }
        html += `</div>`
        courseContainer.innerHTML = html
    }
}