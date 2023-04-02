// ACCEPTANCE CRITERIA
// Begin the game by clicking a start button
// This starts a timer
// First question appears immediately
// When questions are answered, the next shows up
// If an answer is incorrect, it deducts time
// Game is finished when all questions are answered or timer reaches 0
// Can save your initials and score
    // Do this use local storage

// Store questions in one array, with answers in a second array (of arrays), with indexes matching

var timer = document.querySelector("#timer");
var timeLeft = 10

function countdown() {
    timeLeft = 10
    timer.textContent = timeLeft + " seconds left";
    var gameTimer = setInterval(function(){
        timeLeft--
        timer.textContent = timeLeft + " seconds left";
        if(timeLeft===0) {
            clearInterval(gameTimer)
            timer.textContent = "Time's Up!";
        }
    },100)
}

// Button for starting game
var startBtn = document.querySelector("#start");
startBtn.addEventListener("click", function() {
    // Start timer
    // Get rid of button and render question and answers
    console.log("The button works!")
    countdown();
})