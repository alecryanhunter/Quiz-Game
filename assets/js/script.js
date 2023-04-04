// Store questions in one array, with answers in a second array (of arrays), with indexes matching
// Use the 0-index spot in the options array to denote which of the 4 answers is the correct one
var questions = ["Question 1","Question 2","Question 3","Question 4","Question 5"];
var options = [[3,"1A","1B","1C","1D"],[1,"2A","2B","2C","2D"],[4,"3A","3B","3C","3D"],[2,"4A","4B","4C","4D"],[1,"5A","5B","5C","5D"]];
var highScores = []

var startBtn = document.querySelector("#start");
var replayBtn = document.querySelector("#replay");
var timer = document.querySelector("#timer");
var infoField = document.querySelector("#info");
var optionsField = document.querySelector("#options");
var assessment = document.querySelector("#assessment");
var scoreLink = document.querySelector("#scores-link");
var playScreen = document.querySelector(".play");

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
        if(timeLeft<=0) {
            timesUp();
        }
    },1000)
}

// Function for retrieving and printing the questions. Assigns them an index number
function renderQs() {
    optionsField.innerHTML=""
    startBtn.setAttribute("style","display:none");
    if (place >= questions.length) {
        outcome = "win";
        endGame();
    } else {
        infoField.textContent = questions[place]
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

var scoreList = document.querySelector(".play table");
function renderScores() {
    scoreList.innerHTML=""
    infoField.setAttribute("style","display:none")
    while(document.querySelector(".play .hide")) {
        var hide = document.querySelector(".hide")
        playScreen.removeChild(hide)
    }
    startBtn.removeAttribute("style");
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

// This function stringifies the array of highScores and puts it into local storage.
function storeScores() {
    localStorage.setItem("scores",JSON.stringify(highScores))
}


function timesUp() {
    clearInterval(gameTimer)
    timer.textContent = "Time's Up!";
    outcome = "loss";
    endGame();
}

// This function denotes the end of the game, setting the place to 0 for any future
// plays of the game, then checking if the end was due to a "win" or "loss".
function endGame() {
    clearInterval(gameTimer)
    place = 0;
    if (outcome === "loss") {
        startBtn.textContent="Try Again!";
        startBtn.removeAttribute("style");
        optionsField.innerHTML="";
        infoField.textContent = "You Lose!"
    } else {
        // Updates the existing elements to convey information
        infoField.textContent="You Win!"
        timer.textContent = "Thanks for playing!"
        // Creates and appends a line informing you of your score.
        score = timeLeft
        var scoreInfo = document.createElement("h3")
        scoreInfo.setAttribute("class","hide")
        scoreInfo.textContent = "Your score is: " + score;
        playScreen.appendChild(scoreInfo);
        // Creates and appends a line giving instructions on form usage
        var instruct = document.createElement("p")
        instruct.setAttribute("class","hide")
        instruct.textContent = "Enter your initials to save your score!"
        playScreen.appendChild(instruct);
        // Creates and appends the relevant score-tracking form
        var scoreForm = document.createElement("form");
        scoreForm.setAttribute("class","hide")
        var textbox = document.createElement("input");
        textbox.setAttribute("type","text")
        textbox.setAttribute("placeholder","Enter your intials!")
        textbox.setAttribute("minlength","1")
        textbox.setAttribute("maxlength","3")
        var submit = document.createElement("input");
        submit.setAttribute("type","submit")
        submit.setAttribute("value","Submit")
        scoreForm.appendChild(textbox);
        scoreForm.appendChild(submit);
        playScreen.appendChild(scoreForm);        
    }
}

// EVENT LISTENERS

// This function watches for a submission on the end-of-game score saving form.
// It forces all inputs into uppercase and trims, checking for all-whitespace
// inputs. It then creates a new array composed of the input and the score, and
// appends it to the earlier retrieved highScores array. Finally, it renders the
// score list immediately to disallow repeat submissions.
document.addEventListener("submit",function(event){
    event.preventDefault();
    event.target.matches("form")
    retrieveScores();
    var initialsInput = document.querySelector("form input");
    var initials = initialsInput.value.trim();
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
    assessment.textContent=""
})

// This function detects clicks on the question options. It also assesses
// their correctness by comparing the index of the option clicked with the
// zero-index of the relevant question's option array. It modifies the class
// of the assessment for CSS styling. If the option was incorrect, it deducts
// time and checks if that reduced it below 0, if so, ending the game. If not,
// regardless of correctness, it increments the place variable and renders again.
optionsField.addEventListener("click",function(event){
    var answer = event.target;
    var answerIndex = answer.getAttribute("data-index");
    if (answer.matches("li")) {
        if (answerIndex==options[place][0]) {
            assessment.textContent="Correct!"
            assessment.setAttribute("class","correct");
        } else {
            assessment.textContent="Incorrect..."
            assessment.setAttribute("class","wrong");
            timeLeft -= 10
            // TODO: turn this into function since it's used twice?
            if(timeLeft<=0) {
                timesUp();
                return;
            } else {
                timer.textContent = timeLeft + " seconds left";
            }
        }
        place++;
        renderQs();
    }
})

// This function watches for a click on the High Scores element in the header,
// which is present at all times. It stops the timer, changes the text of said
//  timer, removes the assessment text, and then retrieves and renders the list
// of scores. See functions above for more information.
scoreLink.addEventListener("click",function(){
    clearInterval(gameTimer);
    timer.textContent = "Hit the button to start playing!"
    assessment.textContent=""
    retrieveScores();
    renderScores();
})

// This function watches for a click on the start button that appears on page
// load and when the timer expires. It removes the assessment text, starts the
// timer and starts the question rendering process. See functions above for
// more details.
startBtn.addEventListener("click", function() {
    assessment.textContent=""
    startTimer();
    renderQs();
})

// This button is associated with the scores section, being used to replay the
// game on a "win" or if you navigate to the scores tab. It does the same thing
// as the previous button, say hiding the score screen and showing the play screen.
replayBtn.addEventListener("click", function(){
    playScreen.removeAttribute("style");
    scoreScreen.setAttribute("style","display:none");
    assessment.textContent=""
    startTimer();
    renderQs();
})