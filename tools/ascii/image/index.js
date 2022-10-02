const density = 'Ñ@#W$9876543210?!abc;:+=-,._         '

export function loadAscii(ascii, ctx, canvas, image) {
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let fulltext = "";
    for (let y = 0; y < canvas.height; y++) {
        let row = "";
        for (let x = 0; x < canvas.width; x++) {
            const pix = ctx.getImageData(x, y, 1, 1).data;
            const r = pix[0]
            const g = pix[1]
            const b = pix[2]
            const average = (r + g + b) / 3
            const len = density.length;
            const index = average / density.length

            let c = density.charAt(index)
            if (pix[3] < 255) c = ' '
            if (c == ' ') row += "&nbsp;"
            else row += c;
        }
        fulltext += row + "<br />";
    }
    ascii.innerHTML = fulltext;
}