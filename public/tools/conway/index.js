var size = document.getElementById("canvas").width;
var cellsize = 5;
var cells = new Array(size).fill(0);

for (var i = 0; i < cells.length; i++) {
    cells[i] = new Array(size).fill(0);
}

cells[50][10] = 1
cells[51][10] = 1
cells[50][11] = 1
cells[51][11] = 1

cells[100][11] = 1
cells[100][12] = 1
cells[100][13] = 1

export function setPixel(x, y, ctx) {
    ctx.fillStyle = "white"
    ctx.fillRect(x * cellsize, y * cellsize, cellsize, cellsize)
}

export function handleCell(x, y) {
    let live = cells[x][y]
    let neighbors = 0;

    var coords = [
        [(x - 1), (y - 1)],
        [(x - 1), (y)],
        [(x - 1), (y + 1)],
        [(x), (y - 1)],
        [(x), (y + 1)],
        [(x + 1), (y - 1)],
        [(x + 1), (y - 1)],
        [(x + 1), (y + 1)]
    ]

    for (var i = 0; i < coords.length; i++) {
        let nx = coords[i][0]
        let ny = coords[i][1]
        if (ny >= 0 && ny < size && nx >= 0 && nx < size)
            neighbors += cells[nx][ny]
    }

    if (live == 0) {
        if (neighbors == 3) return 1
    }
    if (live == 1) {
        if (neighbors < 2) return 0
        if (neighbors == 2 || neighbors == 3) return 1
        if (neighbors > 3) return 0
    }
    return 0
}

export function run(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (var i = 0; i < cells.length; i++) {
        for (var j = 0; j < cells[i].length; j++) {

            cells[i][j] = handleCell(i, j)


            if (cells[i][j] == 1) {
                setPixel(i, j, ctx)
            }
        }
    }
}