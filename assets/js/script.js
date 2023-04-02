// ACCEPTANCE CRITERIA
// Begin the game by clicking a start button
// This starts a timer
// First question appears immediately
// When questions are answered, the next shows up
// If an answer is incorrect, it deducts time
// Game is finished when all questions are answered or timer reaches 0
// Can save your initials and score
    // Do this using local storage


// Store questions in one array, with answers in a second array (of arrays), with indexes matching
// Use the 0-index spot in the options array to denote which of the 4 answers is the correct one
var questions = ["Question 1","Question 2","Question 3","Question 4","Question 5"];
var options = [[3,"1A","1B","1C","1D"],[1,"2A","2B","2C","2D"],[4,"3A","3B","3C","3D"],[2,"4A","4B","4C","4D"],[1,"5A","5B","5C","5D"]];

var completed = ""
// This function creates an array of x's the same length as the questions, which I can then use to check if that specific question index has been done before, if I implement randomization
// TODO: implement randomization of questions
function completeCreate() {
    for (i=0;i<questions.length;i++) {
        completed = completed+"x"
    }
    completed = completed.split(``);
}
completeCreate()

// This function is for debugging only, making sure that my questions and options are always the same length
function lengthCheck() {
    if (questions.length === options.length) {
    } else {
        console.log("QUESTION/OPTIONS ARRAY LENGTH DISCREPANCY")
    }
}
lengthCheck();

var startBtn = document.querySelector("#start");
var timer = document.querySelector("#timer");
var questionField = document.querySelector("#question")
var optionsField = document.querySelector("#options")
var resultField = document.querySelector("#result")

var timeLeft
// The gameTimer variable must be declared globally or the timer can't be stopped in other functions
var gameTimer
var place = 0
var score = 0


// Countdown timer function
function startTimer() {
    timeLeft = 100
    timer.textContent = timeLeft + " seconds left";
    gameTimer = setInterval(function(){
        timeLeft--
        timer.textContent = timeLeft + " seconds left";
        if(timeLeft===0) {
            clearInterval(gameTimer)
            timer.textContent = "Time's Up!";
        }
    },1000)
}

var gameEnd = document.querySelector("#game-end");


// Function for retrieving and printing the questions. Assigns them an index number
function renderQs() {
    optionsField.innerHTML=""
    startBtn.setAttribute("style","display:none");
    if (place >= questions.length) {
        questionField.textContent = "GAME OVER";
        clearInterval(gameTimer)
        score = timeLeft
        console.log("Your score is:",score)
        endGame();
    } else {
        questionField.textContent = questions[place]
        // We start the for loop at 1 so we can hide the 0-index spot since it contains the answer key
        for (i=1;i<options[place].length;i++) {
            var li = document.createElement("li")
            li.textContent=options[place][i];
            li.dataset.index=i;
            optionsField.appendChild(li)
        }
    }
}

// TODO: add score and name tracking
function endGame() {
    var winForm = document.createElement("input");
    gameEnd.textContent = "Your score is " + score + " points!"
    winForm.setAttribute("maxlength",3)
    gameEnd.appendChild(winForm);
    winForm.addEventListener("submit",function(){
         console.log("blah")
    })
}
    // This function detects clicks on the answer options and determines their correctness. If false, it subtracts time and re-renders the timer to display the subtracted time.
optionsField.addEventListener("click",function(event){
    answer = event.target;
    answerIndex = answer.getAttribute("data-index");
    if (answer.matches("li")) {
        console.log("correct index:",options[place][0])
        console.log("answer index:",answerIndex)
        if (answerIndex==options[place][0]) {
            resultField.textContent="Correct!"
        } else {
            resultField.textContent="Incorrect..."
            timeLeft -= 10
            timer.textContent = timeLeft + " seconds left";
        }
        place++;
        renderQs();
    }
})


// Button for starting game
startBtn.addEventListener("click", function() {
    // Start timer
    // Get rid of button and render question and answers
    startTimer();
    renderQs();
})