export function editDescription(description) {
    const btn = document.getElementById("editdescriptionbtn");
    btn.removeEventListener("click", editDescription);
    btn.innerText = "done";
    
    const desc = document.getElementById("description");
    desc.innerHTML = `<textarea id='descriptioninput' class='yourcommentinput'></textarea>`
    desc.firstChild.value = description;
    desc.appendChild(btn);

    btn.addEventListener("click", finishEditDescription);
}

export function finishEditDescription() {
    const btn = document.getElementById("editdescriptionbtn");
    btn.removeEventListener("click", finishEditDescription);
    btn.addEventListener("click", editDescription);
    btn.innerText = "edit";

    const descinput = document.getElementById("descriptioninput");

    const desc = document.getElementById("description");
    console.log(descinput);
    console.log(descinput.value)
    desc.innerText = descinput.value;
    desc.appendChild(btn);
}