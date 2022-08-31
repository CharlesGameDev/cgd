import { ref, set, get, push, child, update, remove, getDatabase } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";

function timestampToDate(stamp) {
    const date = new Date(stamp * 1000);
    let hours = date.getHours();
    let part = "AM";
    part = hours >= 12 ? "PM" : "AM";
    hours = hours > 12 ? hours -12 : hours;
    hours = hours == 0 ? 12 : hours;

    let minutes = date.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return month + "/" + day + "/" + year + " - " + hours + ":" + minutes + " " + part;
}

export function clearComments() {
    const div = document.getElementById("comments");
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

export function loadComments(comments) {
    clearComments();
    console.log("Loading comments (" + comments.length + ")");
    comments = comments.reverse();
    for (let i = 0; i < comments.length; i++) {
        createComment(comments[i][1], comments[i][0]);
    }
}

function createComment(comment, index) {
    getCommentMeta(index, function(commentMeta) {
        console.log(index);
        const commentdiv = document.createElement("div");
        commentdiv.className = "comment";
        commentdiv.id = index;
    
        commentdiv.appendChild(document.createElement("br"))
        const date = document.createElement("span");
        date.className = "commentbody commentbodysmall";
        date.innerText = timestampToDate(comment.date);
        commentdiv.appendChild(date);
        commentdiv.appendChild(document.createElement("br"))
    
        const author = document.createElement("span");
        author.className = "commentbody";
        author.innerText = comment.sender;
        commentdiv.appendChild(author);
    
        commentdiv.appendChild(document.createElement("br"))
        commentdiv.appendChild(document.createElement("br"))
    
        const message = document.createElement("span");
        message.className = "commentbody";
        message.innerText = comment.text;
        commentdiv.appendChild(message);
    
        commentdiv.appendChild(document.createElement("br"))
        commentdiv.appendChild(document.createElement("br"))
    
        const like = document.createElement("button");
        like.addEventListener("click", () => likeComment(commentMeta));
        like.className = "yourcommentsend yourcommentsend2 material-symbols-outlined";
        like.innerText = "thumb_up";
        like.id = "likebtn";
        const liketext = document.createElement("span");
        liketext.innerText = " " + comment.likes;
        liketext.id = "likes";
    
        commentdiv.appendChild(like);
        commentdiv.appendChild(liketext);
    
        const dislike = document.createElement("button");
        dislike.addEventListener("click", () => dislikeComment(commentMeta));
        dislike.id = "dislikebtn";
        dislike.className = "yourcommentsend yourcommentsend2 material-symbols-outlined";
        dislike.innerText = "thumb_down";
        const disliketext = document.createElement("span");
        disliketext.innerText = " " + comment.dislikes;
        disliketext.id = "dislikes";
    
        commentdiv.appendChild(dislike);
        commentdiv.appendChild(disliketext);
    
        if (commentMeta && commentMeta.owned) {
            const del = document.createElement("button");
            del.addEventListener("click", () => deleteComment(commentMeta));
            del.id = "deletebtn";
            del.className = "yourcommentsend yourcommentsend2 material-symbols-outlined";
            del.innerText = "delete";
    
            commentdiv.appendChild(del);
        }
    
        commentdiv.appendChild(document.createElement("br"))
        commentdiv.appendChild(document.createElement("br"))
    
        const commentsdiv = document.getElementById("comments");
        commentsdiv.appendChild(commentdiv);
        commentsdiv.appendChild(document.createElement("br"));

        formatComment(message);
    });
}

export function formatComment(commentHTML) {
    get(child(ref(getDatabase()), "users")).then((snapshot) => {
        const users = Object.entries(snapshot.val());
        users.forEach(user => {
            commentHTML.innerHTML = commentHTML.innerHTML.replaceAll("@" + user[0], `<a href='profile/?user=${user[0]}'>@${user[0]}</a>`);
        });
    });
}

export function sendMessage() {
    if (!isLoggedIn()) return;
    const stamp = Date.now() / 1000;
    const author = getCookie("username");
    const message = document.getElementById("yourcommentbody").value;
    if (message.trim() == "") return;
    const comment = {"date": stamp, "sender": author, "text": message, "likes": 0, "dislikes": 0};
    console.log("Sending message (" + author + "-" + message + ")")
    
    const db = getDatabase();
    const newPostKey = push(child(ref(db), 'comments')).key;
    
    const updates = {};
    updates["comments/" + newPostKey] = comment;
    updates["users/" + getCookie("username") + "/comments/" + newPostKey] = {"liked": false, "disliked": false, "owned": true};

    update(ref(db), updates);
    document.getElementById("yourcommentbody").value = "";
}

export function saveCommentMeta(commentMeta) {
    const updates = {};
    const meta = {"disliked": commentMeta.disliked, "liked": commentMeta.liked, "owned": commentMeta.owned};
    updates["users/" + getCookie("username") + "/comments/" + commentMeta.id] = meta;

    update(ref(getDatabase()), updates);
}

export function likeComment(commentMeta) {
    if (!isLoggedIn() || !commentMeta) return;
    console.log("like " + commentMeta.id);
    const comment = document.getElementById(commentMeta.id);
    const likes = comment.querySelector("#likes");
    let add = 1;
    if (commentMeta.liked) {
        add = -1;
        commentMeta.liked = false;
    } else {
        commentMeta.liked = true;
    }
    saveCommentMeta(commentMeta);   
    const likesn = Number(likes.innerText) + add;
    likes.innerText = " " + likesn;

    const db = getDatabase();
    set(ref(db, "comments/" + commentMeta.id + "/likes"), likesn)
}

export function dislikeComment(commentMeta) {
    if (!isLoggedIn() || !commentMeta) return;
    console.log("dislike " + commentMeta.id);
    const comment = document.getElementById(commentMeta.id);
    const dislikes = comment.querySelector("#dislikes");
    let add = 1;
    if (commentMeta.disliked) {
        add = -1;
        commentMeta.disliked = false;
    } else {
        commentMeta.disliked = true;
    }
    saveCommentMeta(commentMeta);   
    const dislikesn = Number(dislikes.innerText) + add;
    dislikes.innerText = " " + dislikesn;

    const db = getDatabase();
    set(ref(db, "comments/" + commentMeta.id + "/dislikes"), dislikesn)
}

export function deleteComment(commentMeta) {
    if (!commentMeta || !commentMeta.owned || (!confirm("Are you sure?") || !confirm("Are you super sure?") || !confirm("Are you surer than Raggy after committing kill?"))) return;
    console.log("delete " + commentMeta.id);
    
    const db = getDatabase();
    remove(ref(db, "comments/" + commentMeta.id))
    remove(ref(db, "users/" + getCookie("username") + "/comments/" + commentMeta.id))
    alert("Then the comment was deleted.")
}

export function getLoggedUserMeta(username = "") {
    if (username == "") username = getCookie("username");
    return get(child(ref(getDatabase()), "users/" + username));
}

export function logout() {
    setCookie("username", "");
    setCookie("email", "");
    setCookie("hash", "");
    window.location.reload();
}

export function isLoggedIn() {
    return getCookie("username") != "" && getCookie("hash") != ""
}

export function getCommentMeta(commentID, callback) {
    if (!isLoggedIn()) {
        callback(null);
        return;
    }
    getLoggedUserMeta().then((snapshot) => {
        const allComments = Object.entries(snapshot.val().comments);
        let found = false;
        allComments.forEach(element => {
            if (element[0] == commentID) {
                element[1].id = commentID;
                callback(element[1]);
                found = true;
                return;
            }
        });
        if (!found)
            callback(null);
        return;
    });
}

export function setCookie(cname, cvalue) {
    const d = new Date();
    d.setTime(d.getTime() + (1000*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function firebaseConfig() {
    return {
        apiKey: "AIzaSyCecm7pMfTIu_YS9ycwkb6MtxB6a3_oNq0",
        authDomain: "cgdsite-69ea0.firebaseapp.com",
        projectId: "cgdsite-69ea0",
        storageBucket: "cgdsite-69ea0.appspot.com",
        messagingSenderId: "207581275711",
        appId: "1:207581275711:web:19559593a1d67419ccba8a",
        measurementId: "G-SRC4JBGFHS",
        databaseURL: "https://cgdsite-69ea0-default-rtdb.firebaseio.com",
    };
}