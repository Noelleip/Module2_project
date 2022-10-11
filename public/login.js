
export const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(loginForm)
    // console.log(formData)
    const res = await fetch('/user/login', {
        method: 'POST',
        body: formData,
    })
    if (res.ok) {
        alertify.set('notifier', 'delay', 1.5);
        let successAlert = alertify.success('Login successfully');
        successAlert.callback = function () {
            window.location = '/'
        };
    } else {
        alertify.error('Login fail');
    }

})


// function checkInputs() {
//     const useremailValue = useremail.value.trim();
//     const passwordValue = password.value.trim();

//     if (useremailValue === "") {
//         setErrorFor(useremail, 'Useremail cannot be blank');

//     } else {
//         setErrorFor(useremail);
//     }
//     if (passwordValue === "") {
//         setErrorFor(passwordValue, 'Password cannot be blank');

//     } else {
//         setErrorFor(passwordValue);
//     }
// }

// function setErrorFor(input, messsage) {
//     const formControl = input.parentElement;
//     const small = formControl.querySelector('small')
// }