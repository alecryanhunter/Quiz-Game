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
// Separate array to denote which option is the correct one? Or always have index 0 be the answer and randomize them?
var questions = ["Question 1","Question 2","Question 3"];
var options = [["1A","1B","1C","1D"],["2A","2B","2C","2D"],["3A","3B","3C","3D"]];
var correct = [2,0,3];

var completed = ""
// This function creates an array of x's the same length as the questions, which I can then use to check if that specific question index has been done before, if I implement randomization
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
var next = 0


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

// Function for retrieving and printing the questions. Assigns them an index number
function renderQs() {
    optionsField.innerHTML=""
    startBtn.setAttribute("style","display:none");
    if (next >= questions.length) {
        questionField.textContent = "GAME OVER";
        clearInterval(gameTimer)
        var score = timeLeft
        console.log("Your score is:",score)
    } else {
        questionField.textContent = questions[next]
        for (i=0;i<options[next].length;i++) {
            var li = document.createElement("li")
            li.textContent=options[next][i];
            li.dataset.index=i;
            optionsField.appendChild(li)
        }
    }
}

// This function detects clicks on the answer options and determines their correctness. If false, it subtracts time and re-renders the timer to display the subtracted time.
optionsField.addEventListener("click",function(event){
    answer = event.target;
    answerIndex = answer.getAttribute("data-index");
    if (answer.matches("li")) {
        console.log("correct index:",correct[next])
        console.log("answer index:",answerIndex)
        if (answerIndex==correct[next]) {
            resultField.textContent="Correct!"
        } else {
            resultField.textContent="Incorrect..."
            timeLeft -= 10
            timer.textContent = timeLeft + " seconds left";
        }
        next++;
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