let CELL_GAP = 10;
let CELL_SIZE = 60;
let guesses;
let word = ''; //word for the player to guess
let letter_buttons = []; 
let tile_buttons = []; //list of tiles/guesses
let keyboard = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];
let current_turn; //guess that the user is on
let current_letter;

function setup() { //runs once when the program starts
  createCanvas(windowWidth,windowHeight);
  startGame();
  guesses = [ //six guesses
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''] ]
  current_turn = 0;
  current_letter = 0;
  draw_board();
  draw_keyboard();
}
function draw() { //called continously
  background(0);
   //creating title
   textAlign(CENTER);
   textStyle(BOLD);
   textSize(50);
   fill(255); //title color
   text("Wordle (dupe)", windowWidth/2, windowHeight/10);

}

async function loadwords() {
    const response = await fetch('filtered_words.csv');
    const data = await response.text();

    window.list = data
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const word = line.split(',')[1];
          return word ? word.trim().toUpperCase() : null;
        })
        .filter(word => word !== null)
        .map(word => word.toUpperCase());
}


function generate_word() {
    return window.list[Math.floor(Math.random() * (window.list.length))];
}

function draw_board() {
  for (let i=0; i< guesses.length; i++) {
    for (let j=0; j < guesses[i].length; j++) {
      //draw tile
      let button = createButton();
      button.id = `button${i}_${j}`;
      button.html(guesses[i][j]);
      button.size(40,40);
      button.position(j * 50 + windowWidth/2.5, i * 60 + windowHeight/6);
      tile_buttons.push(button);
    }
  }
}

function handle_input(letter) {
  if (letter == '⌫') {
    guesses[current_turn][current_letter] = '';
    current_letter --;
    updateTileDisplay();
  } else if (letter == 'ENTER'){
    check_if_correct();
    if (current_turn < 5) {
      current_turn ++;
    }
    current_letter = 0;
  }
  else {
    guesses[current_turn][current_letter] = letter;
    if (current_letter < 5) {
      current_letter += 1;
    }
    updateTileDisplay();
  } 
}

function check_if_correct() {
  let word_guessed = '';
  for (let i=0; i<6; i++) {
    word_guessed += guesses[current_turn][i];
  }
  console.log(word_guessed);
  updateColors();
}

function updateTileDisplay () {
  for (let j = 0; j < 6; j++) {
    let tileIndex = current_turn * 6 + j;
    tile_buttons[tileIndex].html(guesses[current_turn][j]);
  }
}

function updateColors() {
  const wordArray = Array.from(word);
  for (let i=0; i<6; i++) {
    if (guesses[current_turn][i] == wordArray[i]) {
      tile_buttons[current_turn * 6 + i].style('background-color', '#538d4e');
    } else if(wordArray.includes(guesses[current_turn][i])) {
      tile_buttons[current_turn * 6 + i].style('background-color', '#FFBF00')
    }
  }
}

function draw_keyboard() {
  for (let i = 0; i < keyboard.length; i++) {
    for (let j = 0; j < keyboard[i].length; j++) {
      let letter_key = createButton();
      letter_key.id = `${keyboard[i][j]}`;
      letter_key.html(keyboard[i][j]);
      letter_key.size(60,50);
      letter_key.position(j * 60 + windowWidth/3.5 + (i%2)*30, i * 60 + windowHeight * (2.5/3.5));

      let letter = keyboard[i][j];
      letter_key.mousePressed(() => handle_input(letter));

      letter_buttons.push(letter_key);
    }
  }
}

function keyPressed () {
  if (key.length === 1 && key.match(/[a-z]/i)) {
    handle_input(key.toUpperCase());
  } else if (keyCode === BACKSPACE) {
    handle_input('⌫');
  } else if (keyCode === ENTER) {
    check_if_correct();
    if (current_turn < 5) {
      current_turn ++;
    }
    current_letter = 0;
  }
}

async function startGame () {
  await loadwords();
  word = generate_word(); //generates a word for player to guess
  console.log(word);
}