/*******************************************************************************************************************
    Moods Example
    by Scott Kildall
    modified by Matt Kwong

    Uses the p5.SimpleStateMachine library. Check the README.md + source code documentation
    The index.html needs to include the line:  <script src="p5.simpleStateManager.js"></script>
*********************************************************************************************************************/

var simpleStateMachine;           // the SimpleStateManager class
var selectedTransitionNum = 0;    // index into the array of transitions
var transitions = [];
var moodImage;
var cursorPosition = 30;

function preload() {
  simpleStateMachine = new SimpleStateManager("assets/moodStates.csv");
}

// Setup code goes here
function setup() {
  createCanvas(1440, 800);
  imageMode(CENTER);

  // setup the state machine with callbacks
  simpleStateMachine.setup(setImage, setTransitionNames);
 }


// Draw code goes here
function draw() {
  drawBackground();
  drawImage();
  drawUI();
}

// this is a callback, which we use to set our display image
function setImage(imageFilename) {
  moodImage = loadImage(imageFilename);
} 

// this is a callback, which we use to diplay next state labels
function setTransitionNames(transitionArray) {
  transitions = transitionArray;
}

//==== KEYPRESSED ====/
function keyPressed() {
  // forward one, check for overflow
  if (keyCode === RIGHT_ARROW) {
    selectedTransitionNum++;
    if( selectedTransitionNum === transitions.length ) {
      selectedTransitionNum = 0;
    }
  }
  
  // back one, check for underflow
  if (keyCode === LEFT_ARROW ) {
    selectedTransitionNum--;
    if( selectedTransitionNum === -1 ) {
      selectedTransitionNum = transitions.length -1;
      if( selectedTransitionNum === -1 ) {
        console.log("error: transition array probably empty");
      }
    }
  }

  // Space or ENTER or RETURN will activate a sections && RESET transitionNum to 0
  if( key === ' ' || keyCode === RETURN || keyCode === ENTER ) {
    simpleStateMachine.newState(transitions[selectedTransitionNum]);
  }
}

//==== MOUSE SUPPORT ====/
function mouseMoved() {
  // You can move the mouse within each third of the window to select the transition
  if (mouseX < width/3) {
    selectedTransitionNum = 0;
  } else if (mouseX >= width/3 && mouseX < (width * 2/3)) {
    selectedTransitionNum = 1;
  } else {
    selectedTransitionNum = 2;
  }
}

// When the mouse is pressed, animate the selector circle
function mousePressed() {
  cursorPosition = 40;
}

// When the mouse is released, it will move states
function mouseReleased() {
  cursorPosition = 30;
  simpleStateMachine.newState(transitions[selectedTransitionNum]);
}

//==== MODIFY THIS CODE FOR UI =====/

function drawBackground() {
  background(240);
}

function drawImage() {
  // Draw yellow circle behind image
  fill("#FFE075");
  noStroke();
  circle(width/2 + 20, (height/2) - 75, 450);

  if( moodImage !== undefined ) {
    image(moodImage, width/2, (height/2) - 50);
  }  
}

function drawUI() {
  push();
  textAlign(CENTER);
  textSize(22);
  var textXOffset = [-180, -70, 40];
  var buttonColors = ["#292F36", "#6497CE", "#FF6B6B"];

  for( let i = 0; i < transitions.length; i++ ) {
    fill(0);
    textStyle(NORMAL);
    
    // Lower the middle text bar
    let textY = height/2;
    if (i == 1) {
      textY = 130;
    }

    // Differentiate the selected transition
    fill("#FFE075");
    if( selectedTransitionNum === i ) {
      fill("#33FFC2");
      circle(360*(i+1) + textXOffset[i] - 50 , height - cursorPosition, 50);
    }

    // Draw text box
    rect(360*(i+1) + textXOffset[i] - 20 , (height - textY) - 10, 210, 500);
    fill(buttonColors[i]);
    rect(360*(i+1) + textXOffset[i] - 10 , (height - textY) - 20, 200, 500);

    // Write text
    fill(255);
    text( transitions[i], 360*(i+1) + textXOffset[i] , (height - textY), 180);

  }

  pop();
}
