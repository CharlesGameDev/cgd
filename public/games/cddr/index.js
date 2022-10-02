let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")
ctx.imageSmoothingEnabled = false;
ctx.fillStyle = "#FF00000";

const arrowPositions = [60, 200, 320, 450];

let current_scene = 1;

const maps = [
    {
        "name": "The End",
        "from": "Traveler's Bane",
        "speed": 0.6,
        "notes": [
            { "type": 0, "pos": 7750 }
        ]
    }
]

const start_actions = [start_scene0, start_scene1]
const draw_actions = [draw_scene0, draw_scene1]
const update_actions = [update_scene0, update_scene1]
const input_actions = [input_scene0, input_scene1]

function update(delta) {
    update_actions[current_scene](delta);
}

function draw() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = "#FFFFFF";
    draw_actions[current_scene]();
}

function input(event) {
    input_actions[current_scene](event);
}

function initListeners() {
    document.removeEventListener("keydown", input, false);
    document.addEventListener("keydown", input, false);
}

startPlaying();

function startPlaying() {
    initListeners();
    start_actions[current_scene]();
    has_started = true;
    let lastUpdate = Date.now();
    setInterval(function() {
        let now = Date.now();
        let delta = now - lastUpdate;
        lastUpdate = now;
        if (has_started)
            update(delta);
        draw();
    }, 0);
}