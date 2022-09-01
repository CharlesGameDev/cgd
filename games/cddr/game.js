let start_timer = 0;
let started = false;

function start_scene0() {
    start_timer = 60;
}

function draw_scene0() {
    for (let i = 0; i < arrowPositions.length; i++) {
        ctx.drawImage(images[i], arrowPositions[i], 30, 96, 96);
    }
    for (let i = 0; i < maps[0].notes.length; i++) {
        const type = maps[0].notes[i].type;
        ctx.drawImage(images[type], arrowPositions[type], maps[0].notes[i].pos, 96, 96);
    }
}

function update_scene0(delta) {
    if (started) {
        for (let i = 0; i < maps[0].notes.length; i++) {
            maps[0].notes[i].pos -= maps[0].speed * delta;
            
            if (maps[0].notes[i].pos < -96) {
                maps[0].notes.splice(i, 1)
            }
        }
    }
    start_timer--;
    if (start_timer <= 0 && !started) {
        started = true;
        playSound(0);
    }
}

function input_scene0(key) {
    switch (key.key) {
        case "ArrowLeft":
        case "a":
        case "f":
            console.log("left");
    }
    key.preventDefault();
}

function start_scene1() {

}

function draw_scene1() {
    drawText("Press any key to start", 160, 240, 32, "Arial")
}

function update_scene1(delta) {
    
}

function input_scene1(key) {
    current_scene = 0;
    start_actions[current_scene]();
    // key.preventDefault();
}