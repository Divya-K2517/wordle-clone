function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}

let word = ''; //word for the player to guess
let guesses = [ //six guesses
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '']
]

async function startGame () {
    await loadwords();
    word = generate_word(); //generates a word for player to guess
}

async function loadwords() {
    const response = await fetch('filtered_words.csv');
    const data = await response.text();

    window.list = data
        .split('/n')
        .map(line => line.split(',')[1])
        .map(word => word.toUpperCase());
}

function generate_word() {
    return window.list[Math.floor(Math.random() * (window.list.length))];
}

