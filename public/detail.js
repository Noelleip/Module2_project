let routePic = document.querySelector(".route-pic-container");
let commentedAreas = document.querySelector(".detail-comment");
let commentInput = document.querySelector(".comment-input");
let commentMemo = document.querySelector(".new-comment-content");
let commentScrollContent = document.querySelector(".new-comment-notice");

commentScrollContent.scrollTop = commentScrollContent.scrollHeight;

let params = new URLSearchParams(window.location.search);
let routeId = params.get("routeId");

async function routePicRow() {
  if (!routeId) {
    throw new Error("routeId is not provided");
  }
  let res = await fetch(`/route/${routeId}`);
  let data = await res.json();
  let routeImage = data.route.image;
  let starNumber = data.route.popularity;

  routePic.innerHTML = /*html*/ `
    <img src="${routeImage}" style="width:100vw; height: 450px; object-fit: cover;">
    <div class="route-name">${data.route.name}</div>
    <div class="route-description">
    <div class="introduction-header">路線概覽</div>
    <div>簡介：${data.route.description}</div>
    <div>距離：${data.route.distance}公里</div>
    <div>需時：${data.route.duration}小時</div>
    <div>難度：${data.route.difficulty}/5</div>
    <div class="popularity">受歡迎程度：<span></span></div>
    </div>`;
  for (let i = 0; i < starNumber; i++) {
    document.querySelector(
      ".popularity"
    ).innerHTML += `<i class="bi bi-star-fill"></i>`;
  }
}

async function starGenerator() {
  if (!routeId) {
    throw new Error("routeId is not provided");
  }
  let res = await fetch(`/route/${routeId}`);
  let data = await res.json();

  console.log(starNumber);
}
starGenerator();

async function commentRecord() {
  if (!routeId) {
    throw new Error("routeId is not provided");
  }
  let res = await fetch(`/route_detail/${routeId}/comments`);
  let data = await res.json();
  let comments = data.comments;
  commentedAreas.innerHTML = "";

  for (let i = 0; i < comments.length; i++) {
    /*html*/
    commentedAreas.innerHTML += `
        <div class="comment-box">
        <div class="comment-row-1">
        <div class="user-pic-container">
        
        ${
          comments[i].user_image
            ? `<img src="/profile_img/${comments[i].user_image}" style="width:50px;height:50px">`
            : `<img src="/profile_img/profile_pic_06.jpg" style="width:50px;height:50px">`
        }
        <div class="username">${comments[i].username}</div>
        </div>
        <div class="created-date">${comments[i].created_at.slice(0, 10)}</div>
        </div>
        
        <div class="comment-row-2">
        <div class="comment-text">${comments[i].comment}</div>        
        </div>
        </div>`;
  }
}

async function commentForm() {
  if (!routeId) {
    throw new Error("routeId is not provided");
  }
  commentInput.innerHTML += `
    <div class="comment-header2">你的評價</div>
    <form id="comment-form" action="/route_detail/${routeId}/comments" method="post">
   
    <textarea class='text' type="text" id="comment" name="comment" placeholder="請輸入你對此路線的評價" cols="5" rows="2"></textarea>
    <br><br>
    <input class='button' type="submit" value="遞交">
    <input class='button' type="reset" value="清除" id='ajax-form-clear-btn'>
    </form>`;

  const commentForm = document.querySelector("#comment-form");
  commentForm.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(commentForm);
      const res = await fetch(`/route_detail/${routeId}/comments`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const commentInfo = data;
      if (res.ok) {
        console.log("submit successfully");
        alertify.success("Submit successfully");
        // window.location = `/detail.html?routeId=${routeId}`
      } else if (!res.ok) {
        console.log("Submit fail");
        alertify.error("Submit fail");
      }
    } catch (err) {
      console.log(err);
    }
  });
}

async function newCommentMemo() {
  let res = await fetch(`/route_detail/comments`);
  let data = await res.json();
  let comments = data.comments;
  // console.log(comments)
  commentMemo.innerHTML = "";
  for (let i = 0; i < comments.length; i++) {
    /*html*/
    commentMemo.innerHTML += `
        <div class="comment-box-2">
        <div class="comment-row-1">
        <div class="user-pic-container">
        ${
          comments[i].user_image
            ? `<img src="/profile_img/${comments[i].user_image}" style="width:50px;height:50px">`
            : `<img src="/profile_img/profile_pic_06.jpg" style="width:50px;height:50px">`
        }
        <div class="username">${comments[i].username}</div>
        </div>
        <div class="created-date">${comments[i].created_at.slice(0, 10)}</div>
        </div> 
        <div class="comment-row-2">
        <div class="comment-text">
        <div>路線：${comments[i].route_name}</div>
        <div>評價：${comments[i].comment}</div> 
        </div>       
        </div>
        </div>`;
  }
  // commentMemo.innerHTML += `
  // <div class="comment-memo-box">
  // <div class="comment-text"></div>
  // </div>`
  // commentMemo.innerHTML += `
  // <div class="comment-memo-box">
  // <div class="comment-text"></div>
  // </div>`
}

routePicRow();
commentRecord();
commentForm();
newCommentMemo();

//io socket
const socket = io.connect();
socket.on("new-socket-connected", (data) => {
  console.log(`new-socket-connected with ${data}`);
});
socket.on("new-comment on detail.html", () => {
  console.log("comment submitted");
  commentRecord();
});
socket.on("new-comment on memo in detail.html", () => {
  newCommentMemo();
  commentScrollContent.scrollTo(0, 5000);
  commentMemo.scrollTo(0, 5000);
});
