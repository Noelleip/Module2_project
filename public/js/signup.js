// window.onload = initSignupPage

// function initSignupPage() {
//     let signupFormElem = document.querySelector('#signup-form')
//     let signupResultElem = document.querySelector('#signup-result')
//     let signupFormActionBtnElem = document.querySelector('#action-btn')
//     let signinHereBtnElem = document.querySelector('.signin-here-btn')
//     let email = document.querySelector('#email')
//     let emailContainer = document.querySelector('#email-container')



//     // signupFormElem.addEventListener('submit', (e) => {
//     //     e.preventDefault()
//     //     register()
//     //     login()
//     // })
//     async function register() {
//         console.log('1234');
//         let signupFormObj = {
//             username: signupFormElem.username.value,
//             password: signupFormElem.password.value,
//             email: signupFormElem.email.value,

//         }
//         let res = await fetch('/user', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(signupFormObj)
//         })


//         let result = await res.json()
//         console.log('result =', result);
//         signupResultElem.innerHTML = result.message
//         if (res.ok) {
//             setTimeout(() => {
//                 window.location = '/index.html'
//             }, 1500)
//         } else {
//             console.log('not success')
//         }
//     }

//     async function login() {
//         let signinFormObj = {
//             username: signupFormElem.username.value,
//             password: signupFormElem.password.value,


//         }
//         let res = await fetch('/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(signinFormObj)
//         })


//         let result = await res.json()
//         console.log('result =', result);
//         signupResultElem.innerHTML = result.message
//         if (res.ok) {
//             setTimeout(() => {
//                 window.location = '/index.html'
//             }, 1500)
//             console.log('login success');
//         } else {
//             console.log("login not success");
//         }
//     }

//     if (signupFormElem) {

//         signupFormElem.addEventListener('submit', async (e) => {


//             console.log('singal form is submiting now');
//             e.preventDefault();
//             console.log(signupFormActionBtnElem.value);
//             if (signupFormActionBtnElem.value == 'Login') {

//                 console.log(signupFormActionBtnElem);
//                 login()
//             }
//             if (signupFormActionBtnElem.value == 'Register') {

//                 console.log(signupFormActionBtnElem);
//                 register()
//             }






//         })
//         signinHereBtnElem.addEventListener('click', () => {
//             if (signinHereBtnElem.innerText.trim() === 'Signin Here') {
//                 signinHereBtnElem.innerText = 'Signup Now'
//                 signupFormActionBtnElem.value = 'Login'
//                 emailContainer.classList.add("hidden")
//             } else {
//                 signinHereBtnElem.innerText = 'Signin Here'
//                 signupFormActionBtnElem.value = 'Register'
//                 emailContainer.classList.remove("hidden")

//             }


//         })
//     }
//     console.log('signup page is loaded');
// }