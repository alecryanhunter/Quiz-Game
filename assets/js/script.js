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
var questions = ["Question 1","Question 2","Question 3"];
var options = [["1A","1B","1C","1D"],["2A","2B","2C","2D"],["3A","3B","3C","3D"]]

var startBtn = document.querySelector("#start");
var timer = document.querySelector("#timer");
var questionField = document.querySelector("#question")
var optionsField = document.querySelector("#options")

var timeLeft = 10

// Function for retrieving and printing the questions
function renderQs() {
    startBtn.setAttribute("style","display:none");
    questionField.textContent = questions[1]
    for (i=0;i<options[1].length;i++) {
        var li = document.createElement("li")
        li.textContent=options[1][i];
        optionsField.appendChild(li)
    }
}

optionsField.addEventListener("click",function(event){
    target = event.target
    if (target.matches("li")) {
        
    }
})

// Countdown timer function
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
    },1000000)
}

// Button for starting game
startBtn.addEventListener("click", function() {
    // Start timer
    // Get rid of button and render question and answers
    countdown();
    renderQs();
})