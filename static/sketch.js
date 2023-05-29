const emptyGrid = []
const rows = columns = 60;

let grid = []

let when = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]
let then = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]

// reset grid
for (let y = 0; y < rows; y++) {
  emptyGrid[y] = []
  for (let x = 0; x < columns; x++) {
    emptyGrid[y][x] = 0
  }
}

function setup() {
  grid = copyArray(emptyGrid)
  seed_grid()
  reset_rules()


  createCanvas(800, 600);
  noStroke()
  frameRate(18)

}

function draw() {
  background(255);

  const new_grid = applyRule({
    when: when,
    then: then
  })
  const change = diffArrays(grid, new_grid)

  // Draw grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      let px = map(x, 0, columns-1, width*0.2, width*0.8)
      let py = map(y, 0, rows-1, height*0.2, height*0.8)
      if (grid[y][x] === 1) {
        fill(0)
      } else {
        fill(255)
      }
      if (change[y][x] == 1) {
        fill(255, 0, 0)
      }
      rect(px, py, (width*0.65)/columns, (height*0.65)/rows)
    }
  }


  // If previous frame is the same as new one, reset rules
  if (compareArrays(grid, new_grid)) {
    reset_rules()
  }
  // Also reset it from time to time just in case it gets to a periodic CA
  if (frameCount % 240 === 0) {
    reset_rules()
  }

  grid = new_grid

}

function copyArray(arr) {
  let n = []
  for(let y = 0; y < arr.length; y++) {
    n[y] = []
    for(let x = 0; x < arr[y].length; x++) {
      n[y][x] = arr[y][x]
    }
  }
  return n
}

function applyRule(params) {
  const {
    when,
    then
  } = params
  let stepGrid = copyArray(grid)
  for (let y = 1; y < rows-1; y++) {
    for (let x = 1; x < columns-1; x++) {
      // For each cell, check neighborhood
      let cell = grid[y][x]
      let startX = x-1
      let endX = x+2
      let aroundCell = [
        grid[               max(y-1, 0)].slice(startX, endX),
        grid[                        y ].slice(startX, endX),
        grid[min(y+1, grid.length)].slice(startX, endX)
      ]
      let matched = matchRule(aroundCell, when)
      if (matched) {
        for (let ly = 0; ly < then.length; ly++) {
          for (let lx = 0; lx < then[ly].length; lx++) {
            if (then[ly][lx] !== null) {
              stepGrid[y-1+ly][x-1+lx] = then[ly][lx]
            }
          }
        }
      }
    }
  }
  return stepGrid
}

function matchRule(around, when) {
  let matched = true
  for (let y = 0; y < when.length; y++) {
    for (let x = 0; x < when[y].length; x++) {
      if (when[y][x] !== null && when[y][x] !== around[y][x]) {
        matched = false
      }
    }
  }
  return matched
}

function compareArrays(a, b) {
  let equal = true
  for( let i = 0; i < a.length; i++) {
    for( let j = 0; j < a[i].length; j++) {
      if (a[i][j] !== b[i][j]) {
        equal = false
      }
    }
  }
  return equal
}

function diffArrays(a, b) {
  const c = copyArray(emptyGrid)
  for( let i = 0; i < a.length; i++) {
    for( let j = 0; j < a[i].length; j++) {
      c[i][j] = a[i][j] - b[i][j]
    }
  }
  return c
}

function seed_grid() {
  for (let y = 0; y < rows; y++) {
    grid[y] = []
    for (let x = 0; x < columns; x++) {
      grid[y][x] = parseInt(random(0, 2))
    }
  }
}

function reset_rules() {

  // reset grid
  seed_grid()


  // seed grid
  /*
  for (let i = 0; i < columns*10; i++) {
    grid[int(random(0, rows))][int(random(0, columns))] = int(random(0, 2))
  }
  */


  // reset rule
  when = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]

  then = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]

  // random when
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (random(10) > 6) {
        when[y][x] = int(random(0, 2))
      }
    }
  }

  // random then
  for (let y = 0; y < 3; y++) {
    for (let x = 0; x < 3; x++) {
      if (random(10) > 2) {
        then[y][x] = int(random(0, 2))
      }
    }
  }

}
