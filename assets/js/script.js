// The questions and options are in paired arrays, with the indices matching for
// corrolated questions and options.

// Use the index-0 spot in the individual options arrays to store which option,
// within that same array, is the correct one. So a '3' in index-0 would indicate
// the third question (or index-3) is the correct one. This also usefully syncs up
// options number and index.
var questions = [
    "Which variety of bread is our bread?",
    "Which of these items is gluten-free?",
    "An order has 3 Mussels, 1 Soup Cup, and 2 Soup Bowls. How much bread will there be?",
    "Which of these does not go on a Ribeye?",
    "Which of these foods is most susceptible to nut allergy contamination?",
    "Which of these items is vegan?",
    "The Fish and Chips batter contains:",
    "The cut of meat used in the Carpaccio is:",
    "The burgers weigh:",
    "The largest component in the salad dressings is:"];
var options = [
    [2,"Sourdough","French","Ciabatta","Crostini"],
    [1,"House Salad","Fish and Chips","Side Bread","Chowder"],
    [2,"12 slices","14 slices","13 slices","15 slices"],
    [2,"Mushrooms","Gastrique","Fingerling Potatoes","Demiglace"],
    [1,"Brussels","Carpaccio","Salmon","Black Cod"],
    [4,"Beet Salad","Ribeye","Potage","None Of The Above"],
    [3,"Flour and Beer.","Flour, Cornstarch, and Beer.","Flour, Cornstarch, Beer, and Vodka.","Flour, Cornstarch, Corn Meal, Beer, and Vodka."],
    [4,"Flank","Skirt","Sirloin","Ribeye"],
    [2,"10 ounces","8 ounces","6 ounces","None of the Above"],
    [3,"Water","Vinegar","Oil","Fruit Puree"]];
var highScores = []

// These are all the DOM nodes I need globally, declared at the top.
var startBtn = document.querySelector("#start");
var replayBtn = document.querySelector("#replay");
var timer = document.querySelector("#timer");
var infoField = document.querySelector("#info");
var optionsField = document.querySelector("#options");
var assessment = document.querySelector("#assessment");
var scoreLink = document.querySelector("#scores-link");
var playScreen = document.querySelector(".play");

// These are all the global variables I need, also declared at the top.
var timeLeft
var gameTimer
var place = 0
var score = 0
var outcome
var pause = false;

// TIMING FUNCTIONS

// This is the timer function. When called, it starts a timer that decrements
// every second, checking if the time has reached 0. If it has, it calls the
// timesUp function listed below.
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

// This function is called as part of an if statement checking if the game time
// has reached 0. Once it's called, it ends the game as a loss.
function timesUp() {
    clearInterval(gameTimer)
    timer.textContent = "Time's Up!";
    outcome = "loss";
    endGame();
}

// SCORE TRACKING FUNCTIONS

// This simple function pulls and parses the scores from Local Storage, checks
// if it's empty, and if it isn't, overwrites the current highScores array.
function retrieveScores() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));
    if (storedScores !== null) {
        highScores = storedScores;
    }
}

// This function is what displays the scores.
function renderScores() {
    var scoreList = document.querySelector(".play table");

    // Sorts the highScores list, then deletes any highScores already rendered.
    highScores.sort((a,b) => b[1] - a[1])
    scoreList.innerHTML=""

    // Hides everything else, shows the Start Button.
    infoField.setAttribute("style","display:none")
    startBtn.removeAttribute("style");
    while(document.querySelector(".play .hide")) {
        var hide = document.querySelector(".hide")
        playScreen.removeChild(hide)
    }

    // Iterates over the highScores array, creating a row to hold two cells, then
    // filling those cells with the initials and the score respectively, and then
    // appending it to each other and the table.
    for (i=0;i<highScores.length;i++) {
        var tr = document.createElement("tr")
        var td1 = document.createElement("td")
        var td2 = document.createElement("td")
        tr.setAttribute("class","hide")
        td1.textContent=highScores[i][0]
        td1.setAttribute("class","hide")
        td2.textContent=highScores[i][1]
        td2.setAttribute("class","hide")
        tr.appendChild(td1)
        tr.appendChild(td2)
        scoreList.appendChild(tr)
    }
}

// This function first sorts the existing highScores array using the score numbers,
// then stringifies it and stores that string in Local Storage.
function storeScores() {
    highScores.sort((a,b) => b[1] - a[1])
    localStorage.setItem("scores",JSON.stringify(highScores))
}

// QUESTION RENDERING FUNCTION

// This function retrieves and renders the questions and their options.
function renderQs() {

    // Removes any options already present, shows the question field and hides
    // the Start button.
    optionsField.innerHTML=""
    infoField.removeAttribute("style");
    startBtn.setAttribute("style","display:none");

    // Checks if the place variable, which tracks which question we're at, exceeds
    // the length of the questions array which would mean the end of the game.
    if (place >= questions.length) {
        // If true, sets the outcome to "win" and ends the game.
        outcome = "win";
        endGame();
    } else {
        // If false, it proceeds with rendering the next question and it's options.
        // The loop starts with i at 1, since the options array has "hidden" data
        // at index-0. It then creates, fills, and appends an li to the ul.
        infoField.textContent = questions[place]
        for (i=1;i<options[place].length;i++) {
            var li = document.createElement("li")
            li.textContent=options[place][i];
            li.dataset.index=i;
            optionsField.appendChild(li)
        }
        // This undoes the pause, allowing questions to be selected again. Without
        // this, you could "queue" clicks and finish the entire game before the next
        // set of options rendered.
        pause = false;
    }
}

// GAME END FUNCTION

// This function denotes the end of the game.
function endGame() {
    // Clears timer and sets place to 0.
    clearInterval(gameTimer)
    place = 0;
    if (outcome === "loss") {
        // If time expires, it changes the Start button to say "Try Again!"
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
        submit.setAttribute("class","submitBtn")
        scoreForm.appendChild(textbox);
        scoreForm.appendChild(submit);
        playScreen.appendChild(scoreForm);        
    }
}

// EVENT LISTENERS

// This function watches for a submission on the end-of-game score saving form.
document.addEventListener("submit",function(event){
    event.preventDefault();
    event.target.matches("form")
    // Retrieves the existing list of scores, if any, from Local Storage.
    retrieveScores();
    var initialsInput = document.querySelector("form input");
    // Trims the input, capitalizes it, and checks if it's all-whitespace.
    var initials = initialsInput.value.trim();
    initials = initials.toUpperCase();
    if (initials === "") {
        return;
    }
    // Creates a new array, appends the initials, then the score, then appends
    // that array onto the highScores array.
    var newScore = []
    newScore.push(initials);
    newScore.push(score);
    highScores.push(newScore)
    // Stores and renders the new array.
    storeScores();
    renderScores();
    // Changes the Start button text since you've now played once already.
    startBtn.textContent="Play Again"
})

// This function detects clicks on the question options. The .wrong and .correct
// classes are used for adding CSS styling dynamically.
optionsField.addEventListener("click",function(event){
    // This disallows the user from clicking options while the setTimeout below
    // is waiting to execute.
    if (pause) {
        return;
    }
    var answer = event.target;
    var answerIndex = answer.getAttribute("data-index");
    var correct = options[place][0]
    // First checks if the element clicked was one of the options.
    if (answer.matches("li")) {
        // If so, it checks if the option clicked was correct.
        if (answerIndex==correct) {
            answer.setAttribute("class","correct");
        } else {
            // If incorrect, applies .wrong class, deducts time, updates the
            // assessment with the correct answer, then deducts time, checking
            // if it exceeded the time allotment.
            answer.setAttribute("class","wrong");
            assessment.textContent="Correct answer was: " + options[place][correct]
            timeLeft -= 10
            if(timeLeft<=0) {
                timesUp();
                return;
            } else {
                timer.textContent = timeLeft + " seconds left";
            }
        }
        // This gives the player a brief moment to see the assessment and correct
        // answer, then moves on to the next question.
        pause = true;
        setTimeout(function(){
            assessment.textContent = ""
            place++;
            renderQs();
        },1000);
    }
})

// This function watches for a click on the High Scores element in the header,
// which is present at all times. It stops the timer, changes the text of said
// timer, removes the assessment text, and then retrieves and renders the list
// of scores. See relevant functions above for more information.
scoreLink.addEventListener("click",function(){
    clearInterval(gameTimer);
    // Without setting place to 0, you could go to the High Scores tab mid-game
    // and then resume from that spot with a fresh timer.
    place=0
    timer.textContent = "Hit the button to start playing!";
    assessment.textContent="";
    optionsField.innerHTML="";
    retrieveScores();
    renderScores();
})

// This function watches for a click on the start button that appears on page
// load and when the timer expires. It removes the assessment text, hides all
// other objects on the page, then starts the timer and starts rendering the
// questions. See relevant functions above for more details.
startBtn.addEventListener("click", function() {
    for (i=0;i<highScores.length;i++) {
        var hide = document.querySelector(".hide")
        var table = document.querySelector(".play table")
        table.removeChild(hide)
    }
    assessment.textContent=""
    startTimer();
    renderQs();
})