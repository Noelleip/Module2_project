let topMenuElem = document.querySelector('#top_menu')

if (topMenuElem) {
    topMenuElem.innerHTML = /*html*/ `
    <div class="top_menu">
    <ul class="nav nav-pills">

        <li class="nav-item-dropdown-vision">
            <a class="nav-link-dropdown-toggle" href="/our_vision_and_mission.html" role="button"
                aria-expanded="false">Our Vision and Mission</a>

        <li class="nav-item-dropdown-center">
            <a class="nav-link-dropdown-toggle"  href="/our_story.html" role="button"
                aria-expanded="false">Our Story</a>

        <li class="nav-item-dropdown-partners">
            <a class="nav-link-dropdown-toggle"  href="/become_our_partners.html" role="button"
                aria-expanded="false">Become our partners</a>

        <li class="nav-item-dropdown-contact">
            <a class="nav-link-dropdown-toggle"  href="/contact_us.html" role="button"
                aria-expanded="false">Contact Us</a>
            <!--<ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><a class="dropdown-item" href="#">Something else here</a></li>
                            <li><a class="dropdown-item" href="#">Separated link</a></li>
                        </ul>-->
    </ul>
</div>`
}



