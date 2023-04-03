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
var highScores = []

var startBtn = document.querySelector("#start");
var replayBtn = document.querySelector("#replay");
var timer = document.querySelector("#timer");
var questionField = document.querySelector("#question");
var optionsField = document.querySelector("#options");
var resultField = document.querySelector("#result");
var initialForm = document.querySelector("form");
var initialInput = document.querySelector("#initials");
var endScreen = document.querySelector(".game-end");
var playScreen = document.querySelector(".play");
var scoreScreen = document.querySelector(".scores");
var scoreLink = document.querySelector("#scores-link");
var scoreList = document.querySelector(".scores table");

var timeLeft
// The gameTimer variable must be declared globally or the timer can't be stopped in other functions
var gameTimer
var place = 0
var score = 0
var outcome

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
            outcome = "loss"
            endGame();
        }
    },1000)
}

// Function for retrieving and printing the questions. Assigns them an index number
function renderQs() {
    optionsField.innerHTML=""
    startBtn.setAttribute("style","display:none");
    if (place >= questions.length) {
        clearInterval(gameTimer)
        score = timeLeft
        document.querySelector(".game-end h3").textContent = "Your score is: " + score;
        outcome = "win";
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

function retrieveScores() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores !== null) {
        highScores = storedScores;
    }
}

function renderScores() {
    scoreList.innerHTML=""
    playScreen.setAttribute("style","display:none");
    endScreen.setAttribute("style","display:none");
    scoreScreen.removeAttribute("style");
    replayBtn.textContent = "Play the Game";
    for (i=0;i<highScores.length;i++) {
        var tr = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        td1.textContent=highScores[i][0]
        td2.textContent=highScores[i][1]
        tr.appendChild(td1)
        tr.appendChild(td2)
        scoreList.appendChild(tr)
    }
}

function storeScores() {
    localStorage.setItem("scores",JSON.stringify(highScores))
}

function endGame() {
    place = 0;
    if (outcome === "loss") {
        optionsField.innerHTML="";
        questionField.textContent = "You Lose!"
    } else {
        endScreen.setAttribute("style","display:flex;")
        playScreen.setAttribute("style","display:none")
    }
}

// TODO: Restrict form input to characters only??
initialForm.addEventListener("submit",function(event){
    event.preventDefault();
    retrieveScores();
    var initials = initialInput.value.trim();
    initials = initials.toUpperCase();
    if (initials === "") {
        return;
    }
    var newScore = []
    newScore.push(initials);
    newScore.push(score);
    highScores.push(newScore)
    storeScores();
    renderScores();
    replayBtn.textContent = "Play Again";
    resultField.textContent=""
})

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

// this function sends you to the high scores if you click on the item in the heading
scoreLink.addEventListener("click",function(){
    console.log("go to high scores");
    clearInterval(gameTimer);
    timer.textContent = "Hit the button to start playing!"
    resultField.textContent=""
    retrieveScores();
    renderScores();
})

// Button for starting game
startBtn.addEventListener("click", function() {
    // Start timer
    // Get rid of button and render question and answers
    resultField.textContent=""
    startTimer();
    renderQs();
})

// Button for replaying - found at endgame and on the score page
replayBtn.addEventListener("click", function(){
    console.log("replay the game");
    playScreen.removeAttribute("style");
    scoreScreen.setAttribute("style","display:none");
    resultField.textContent=""
    startTimer();
    renderQs();
})