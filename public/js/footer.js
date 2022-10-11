let footerElem = document.querySelector('#footer')

if (footerElem) {
    footerElem.innerHTML = /*html*/ `
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <div class="social-container>
            <div class="social-media>

            
            <a href="https://www.facebook.com/" class="fa fa-facebook"></a>
            <a href="https://twitter.com/i/flow/login" class="fa fa-twitter"></a>
            <a href="https://www.instagram.com/accounts/login/" class="fa fa-instagram"></a>
            <a href="https://accounts.google.com/ServiceLogin" class="fa fa-youtube"></a>
            

        </div>
            </div>    
    <div class="footer">
        
        <div class="footer-container">
            <div class="footer-column">
                <div class="footer-list-topic">About us</div>
                <div class="footer-list-details">Contact us</div>
                <div class="footer-list-details">Our partners</div>
                <div class="footer-list-details">Become a partner</div>
            </div>
            <div class="footer-column">
                <div class="footer-list-topic">Login</div>
                <div ><a href="./login.html"class="footer-list-details"> User login</a></div>
                <div ><a href="./register.html"class="footer-list-details">Register</a></div>
            </div>   
        </div>
        <img src="./index_img/footer-label.jpeg" class="payment-label img" alt="">
    </div>`
}

