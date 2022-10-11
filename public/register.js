
async function register() {
    const registerForm = document.querySelector('#register-form')
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm)
        const res = await fetch('/user/register', {
            method: 'POST',
            body: formData,
        })

        if (res.ok) {
            alertify.set('notifier', 'delay', 1.5);
            let successAlert = alertify.success('Register successfully');
            successAlert.callback = function () {
                window.location = '/'
            };
        } else {
            alertify.error('Register fail');
        }
    })
}
register()

