// let logoutButton = document.querySelector('#logoutButton')
// logoutButton.addEventListener('click',logout())




async function logout() {
    const res =
        await fetch('/logout')
    if (res.ok) {

        window.location.reload()
    }
}
// async function homeLogout(){
//     await logout()
//     user.innerHTML = 'HI, ' + data.data
// }