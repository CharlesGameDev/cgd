const images = ["arrow_left", "arrow_down", "arrow_up", "arrow_right"]
for (let i = 0; i < images.length; i++) {
    console.log("Creating image " + "./img/" + images[i]);
    let img = document.createElement("img");
    img.src = "./img/" + images[i] + ".png";
    images[i] = img;
}

const sounds = ["music_theend"]
for (let i = 0; i < sounds.length; i++) {
    console.log("Creating sound " + "./sound/" + sounds[i]);
    let audio = document.createElement("audio");
    audio.src = "./sound/" + sounds[i] + ".wav";
    sounds[i] = audio;
}
Audio.prototype.stop = function() {
    this.pause();
    this.currentTime = 0;
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }

function drawText(text, x, y, size, font="operator") {
    ctx.font = size + "px " + font;
    ctx.fillText(text, x, y);
}

function drawTextInd(text, x, y, size) {
    let sx = x;
    let xspacing = 17;
    let charmode = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let nextChar = text[i + 1];
        if (char == "&") {
            y += 30;
            x = sx + (xspacing * 2);
        }
        else if (char == "|") {
            ctx.fillStyle = colorFromChar(nextChar);
            i += 1;
            continue;
        }
        else if (char == "@") {
            charmode = Number.parseInt(nextChar);
            i += 1;
            continue;
        }
        else {
            let cx = x;
            let cy = y;
            if (charmode == 1) {
                cx += randomRange(-1, 1);
                cy += randomRange(-1, 1);
            }
            drawText(char, cx, cy, size);
            x += xspacing
        }
    }
}

function colorFromChar(char) {
    char = char.toLowerCase();
    if (char == "y") return "#FFFF00";
    if (char == "w") return "#FFFFFF";
    if (char == "r") return "#FF0000";
    if (char == "g") return "#00FF00";
    if (char == "b") return "#0000FF";
    return "#000000";
}

function playSound(index) {
    sounds[index].stop();
    sounds[index].play();
}

function wrap(value, min, max) {
    if (value < min) value = max;
    if (value > max) value = min;
    return value;
}