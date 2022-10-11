let easyFormDefaultBtnElem;
let multerFormDefaultBtnElem;
let ajaxFormDefaultBtnElem;
let ajaxFormClearBtnElem;
let ajaxFormElem;
let applicationClearBtnElem;
let profileImageElem;

window.onload = (event) => {
    console.log("HTML 已經load完");

    // Query selector
    easyFormDefaultBtnElem = document.querySelector("#easy-form-default-btn");
    multerFormDefaultBtnElem = document.querySelector(
        "#multer-form-default-btn"
    );
    ajaxFormDefaultBtnElem = document.querySelector("#ajax-form-default-btn");
    ajaxFormClearBtnElem = document.querySelector("#ajax-form-clear-btn");
    ajaxFormElem = document.querySelector("form#ajax-form");
    applicationClearBtnElem = document.querySelector("#application-clear-btn");
    profileImageElem = document.querySelector("#profileImage");

    // Event Listener
    applicationClearBtnElem.addEventListener("click", clearApplications);
    ajaxFormElem.addEventListener("submit", ajaxSubmitApplication);

    easyFormDefaultBtnElem.addEventListener("click", () => {
        let easyFromNameElem = document.querySelector(
            "#easy-form input[name=name]"
        );
        let easyFromAgeElem = document.querySelector(
            "#easy-form input[name=age]"
        );
        let easyFromEmailElem = document.querySelector(
            "#easy-form input[name=email]"
        );
        let easyFromBirthdayElem = document.querySelector(
            "#easy-form input[name=birthday]"
        );
        easyFromNameElem.value = "Tecky小狗";
        easyFromAgeElem.value = 20;
        easyFromEmailElem.value = "dog@tecky.com";
        easyFromBirthdayElem.value = "2021-07-01";
    });

    multerFormDefaultBtnElem.addEventListener("click", () => {
        let multerFromNameElem = document.querySelector(
            "#multer-form input[name=name]"
        );
        let multerFromAgeElem = document.querySelector(
            "#multer-form input[name=age]"
        );
        let multerFromEmailElem = document.querySelector(
            "#multer-form input[name=email]"
        );
        let multerFromBirthdayElem = document.querySelector(
            "#multer-form input[name=birthday]"
        );
        multerFromNameElem.value = "黃萬發";
        multerFromAgeElem.value = 20;
        multerFromEmailElem.value = "demo@test.com";
        multerFromBirthdayElem.value = "2021-07-01";
    });

    ajaxFormDefaultBtnElem.addEventListener("click", () => {
        let ajaxFromNameElem = document.querySelector(
            "#ajax-form input[name=name]"
        );
        let ajaxFromAgeElem = document.querySelector(
            "#ajax-form input[name=age]"
        );
        let ajaxFromEmailElem = document.querySelector(
            "#ajax-form input[name=email]"
        );
        let ajaxFromBirthdayElem = document.querySelector(
            "#ajax-form input[name=birthday]"
        );
        ajaxFromNameElem.value = "陳Andy";
        ajaxFromAgeElem.value = 45;
        ajaxFromEmailElem.value = "ajax@test.com";
        ajaxFromBirthdayElem.value = "1999-07-01";
    });

    profileImageElem.addEventListener("change", previewImage);

    getApplications();
};
function ajaxSubmitApplication(event) {
    // 叫張form乜都唔好做，唔好換頁，等我地自己handle
    event.preventDefault();
    let formObject = event.target;
    if (formObject.type.value === "formObject") {
        ajaxSubmitApplicationSimple(formObject);
    } else {
        ajaxSubmitApplicationMulter(formObject);
    }
    ajaxFormClearBtnElem.click();
    document.querySelector("#profileImage-preview").src = "";
}

async function ajaxSubmitApplicationSimple(formObject) {
    try {
        // Prepare Data
        let applicationObj = {
            name: formObject.name.value,
            age: formObject.age.value,
            email: formObject.email.value,
            birthday: formObject.birthday.value,
        };
        if (formObject.profileImage.files[0]) {
            applicationObj.profileImage = formObject.profileImage.files[0].name;
        }
        // Ajax Call Server
        const res = await fetch(
            "http://localhost:8888/application/ajax/simple",
            {
                method: "POST", // Specific your HTTP method
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(applicationObj), // Specify the Request Body
            }
        );
        // Result handling
        const content = await res.json();
        if (res.ok) {
            document.querySelector("#server-response").innerHTML = `
            <span class='success'>${content.code}-${content.msg}</span>
            `;
        } else {
            document.querySelector("#server-response").innerHTML = `
            <span class='error'>${content.code}-${content.msg}</span>
            `;
        }
    } catch (error) {
        console.log(error);
    } finally {
        getApplications();
    }
}

async function ajaxSubmitApplicationMulter(formObject) {
    try {
        // Prepare Data
        let formData = new FormData(formObject);
        // Ajax Call Server
        const res = await fetch(
            "http://localhost:8888/application/ajax/multer",
            {
                method: "POST", // Specific your HTTP method
                body: formData, // Specify the Request Body
            }
        );
        // Result handling
        const content = await res.json();
        if (res.ok) {
            document.querySelector("#server-response").innerHTML = `
            <span class='success'>${content.code}-${content.msg}</span>
            `;
        } else {
            document.querySelector("#server-response").innerHTML = `
            <span class='error'>${content.code}-${content.msg}</span>
            `;
        }
    } catch (error) {
        console.log(error);
    } finally {
        getApplications();
    }
}

const msg = new URL(window.location.href).searchParams.get("msg");
if (msg) {
    alert(msg);
    window.location.href = "/";
}

async function getApplications() {
    // Get 既Ajax call 乜options 都唔需要
    const applicationReuslt = await fetch("/application");
    const applicationData = await applicationReuslt.json();

    let htmlString = `<table>
    <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Email</th>
        <th>Birthday</th>
        <th>Profile Image</th>
        <th>Create Date</th>
    </tr>
    `;
    for (let application of applicationData) {
        let imgTag = await getImageTag(application.profileImage);
        htmlString += `
        <tr>
            <td>${application.name}</td>
            <td>${application.age}</td>
            <td>${application.email}</td>
            <td>${application.birthday}</td>
            <td>${imgTag}</td>
            <td>${application.createDate}</td>
        </tr>
        `;
    }
    htmlString += "</table>";
    document.querySelector("#applications .counter").innerHTML =
        applicationData.length;
    document.querySelector("#application-container").innerHTML = htmlString;
}

async function getImageTag(imageFileName) {
    if (!imageFileName) {
        return "N/A";
    }
    const fetchImageResult = await fetch(`/${imageFileName}`);
    if (!fetchImageResult.ok) {
        return imageFileName;
    } else {
        return `<img class='profile-image' src='${imageFileName}' alt="profile image">`;
    }
}

async function clearApplications() {
    const clearApplicationReuslt = await fetch("/application", {
        method: "DELETE",
    });
    getApplications();
}

function previewImage(event) {
    const [file] = event.target.files;
    if (file) {
        document.querySelector("#profileImage-preview").src =
            URL.createObjectURL(file);
    }
}
