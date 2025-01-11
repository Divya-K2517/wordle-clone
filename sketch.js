

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
  background(248, 237, 235);
   //creating title
   textAlign(CENTER);
   textStyle(BOLD);
   textSize(50);
   fill(70, 18, 32); //title color
   textFont('Courier New')
   text("Wordle (dupe)", windowWidth/2, windowHeight/10);
}

async function loadwords() {
    const response = await fetch('filtered_words.csv');
    const data = await response.text();

    window.list = data
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          const word = line.split(',')[2];
          return word ? word.trim().toUpperCase() : null;
        })
        .filter(word => word !== null)
        .map(word => word.toUpperCase());
    console.log('loaded words');
}

async function load_answers () {
  const responseA = await fetch('filtered_possible_answers.csv');
  const dataA = await responseA.text();

  window.possible_A = dataA
      .split('\n')
      .filter(line => line.trim() !== '')
      .map(line => {
        const word = line.split(',')[2];
        return word ? word.trim().toUpperCase() : null;
      })
      .filter(word => word !== null)
      .map(word => word.toUpperCase());

  console.log('loaded possible answers');
}


function generate_word() {
  if (!window.possible_A || window.possible_A.length === 0) {
    console.error("Possible answers list is empty or undefined");
    return null;
  }
  return window.possible_A[Math.floor(Math.random() * (window.possible_A.length))];
}

function draw_board() {
  for (let i=0; i< guesses.length; i++) {
    for (let j=0; j < guesses[i].length; j++) {
      //draw tile
      let button = createButton();
      button.id = `button${i}_${j}`;
      button.size(40,40);
      button.position(j * 50 + windowWidth/2.5, i * 60 + windowHeight/6);
      //style
      button.style('font-family', 'Monospace, Courier New');
      button.style('font-weight', 'bold');
      button.style('color', 'rgb(70, 18, 32)')
      button.style('border', '2px solid rgb(70, 18, 32)');
      button.html(guesses[i][j]);
      
      tile_buttons.push(button);
    }
  }
}

function handle_input(letter) {
  if (letter == '⌫') {
    if (guesses[current_turn][current_letter] === '') {
      current_letter--;
    }
    guesses[current_turn][current_letter] = '';
    updateTileDisplay();
  } else if (letter == 'ENTER'){
    r = check_if_correct();
    if (current_turn < 5 && r == 3) {
      current_turn ++;
      current_letter = 0;
    } 
  }

  else {
    guesses[current_turn][current_letter] = letter;
    if (current_letter < 5) {
      current_letter += 1;
    }
    updateTileDisplay();
  } 
}

function check_if_correct() { //1 = correct answer, 2 = not enough letters, 3 = enough letters but wrong, 4 = not a valid word
  let word_guessed = '';
  for (let i=0; i<6; i++) {
    word_guessed += guesses[current_turn][i];
  }
  if (word_guessed.length < 6) {
    displayMessage("Not enough letters");
    return 2;
  }
  console.log(word_guessed);

  if (!window.list.includes(word_guessed)) {
    displayMessage("Not a valid word");
    return 4;
  }

  updateColors();

  if (word_guessed == word) {
    displayMessage("Congrats, you guessed the word!")
    return 1;
  } else if (word_guessed != word && current_turn == 5) {
    displayMessage("Incorrect, the word was: `${word}`");
    return 3;
  }
  return 3;
}

function updateTileDisplay () {
  for (let j = 0; j < 6; j++) {
    let tileIndex = current_turn * 6 + j;
    tile_buttons[tileIndex].html(guesses[current_turn][j]);
  }
}

function updateColors() {
  let wordArray = Array.from(word);
  let coloredIndices = new Set();
  //green tiles
  for (let i=0; i<6; i++) {
    if (guesses[current_turn][i] == wordArray[i]) { 
      //turning the tile green
      tile_buttons[current_turn * 6 + i].style('background-color', 'rgb(140, 47, 57)');
      //turning the key on the on-screen keyboard green
      let letter = letter_buttons.find(button => button.id === guesses[current_turn][i]);
      letter.style('background-color', 'rgb(140, 47, 57)');
      wordArray[i] = null;
      coloredIndices.add(i);
    }
  }
   //yellow tiles
  for (let i=0; i<6; i++) {
    if (!coloredIndices.has(i)) {
      let index = wordArray.indexOf(guesses[current_turn][i]); //correct index of the letter
      if (index !== -1) { //index == -1 if the letter in not found in the correct word
        tile_buttons[current_turn * 6 + i].style('background-color', 'rgb(255, 181, 167)');
        
        let letter = letter_buttons.find(button => button.id === guesses[current_turn][i]);
        letter.style('background-color', 'rgb(255, 181, 167)');
        wordArray[index] = null;
        coloredIndices.add(i);
      }
    }
  }
  //gray tiles
  for (let i=0; i<6; i++) { 
    if (!coloredIndices.has(i) ){
      //turning the tile gray
      tile_buttons[current_turn * 6 + i].style('background-color', 'rgb(214, 204, 194)');
      //turning the key on the on-screen keyboard yellow
      let letter = letter_buttons.find(button => button.id === guesses[current_turn][i]);
      letter.style('background-color', 'rgb(214, 204, 194)');
      wordArray[i] = null;
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
      //style
      letter_key.style('font-family', 'Monospace, Courier New')
      letter_key.style('font-weight', 'bold');
      letter_key.style('color', 'rgb(70, 18, 32)')
      letter_key.style('border', '1px solid rgb(70, 18, 32)');
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
    r = check_if_correct();
    if (current_turn < 5 && r == 3) {
      current_turn ++;
      current_letter = 0;
    } 
  }
}

function displayMessage(msg) {
  if (window.messageEl) { //deleting current message element if it exists
    window.messageEl.remove();
  }
  //message container
  window.messageEl = createDiv('');
  window.messageEl.class('message-container');
  window.messageEl.position(windowWidth/2, windowHeight/3);
  //message content
  let content = createDiv(msg);
  content.parent(window.messageEl);
  content.class('message content');
  window.messageEl.html(msg);
  //X button
  let closeButton = createButton('X');
  closeButton.parent(window.messageEl);
  closeButton.class('close-button');
  closeButton.mousePressed(() => {
    window.messageEl.remove();
    window.messageEl = null;
  });
  //styling
  window.messageEl.style('background-color', 'rgb(0,255,0)');

}

async function startGame () {
  await loadwords();
  await load_answers();
  word = generate_word(); //generates a word for player to guess
  console.log(word);
  if (!word) {
    console.error("Failed to generate a word");
  }
}