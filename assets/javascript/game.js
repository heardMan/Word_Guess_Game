//DECLARE VARIABLES

var startGameElem = document.getElementById("start-game");
var winsElem = document.getElementById("wins");
var wordXElem = document.getElementById("wordX");
var guessesElem = document.getElementById("guesses");
var letterBankElem = document.getElementById("letter-bank");
var easyDifficulty = document.getElementById("exampleRadios1");
var normalDiffculty = document.getElementById("exampleRadios2");
var hardDifficulty = document.getElementById("exampleRadios3");
var pokemon = document.getElementById("pokemon");
var audioElement = document.createElement("audio");
var wins = 0;
var guesses;
var wordBlanks = [];
var chosenWord = "";
var userInput = [];
var alreadyGuessed = [];
var wordBank = [
    "bulbasaur",
    "charizard",
    "charmander",
    "pikachu",
    "squirtle"
]

//FUNCTION SETUP

//setGuesses
var setGuesses = function () {

    if (easyDifficulty.checked) {
        guesses = chosenWord.length + 4;
    } else if (normalDiffculty.checked) {
        guesses = chosenWord.length + 2;
    } else if (hardDifficulty.checked) {
        guesses = chosenWord.length;
    }

}

//clearWord: clears old word
var clearWord = function () {
    wordBlanks = [];
    chosenWord = "";
    userInput = [];
    letterBankElem.textContent = userInput;
}

// chooseWord: selects word from the wordBank array
var chooseWord = function () {
    var randomNum = Math.floor(Math.random() * wordBank.length);
    var aiSelect = wordBank[randomNum];
    chosenWord += aiSelect;
    console.log(chosenWord);
    console.log(chosenWord.length);
}

// printArrayNoCommas prints the wordBlanks Array without any commas and updates the page element
var printArrayNoCommas = function (arr, elem) {
    var arrToString = arr.toString();
    var spacesNowCommas = arrToString.replace(/,/g, " ");
    elem.textContent = spacesNowCommas;
    setTimeout(checkWin, 200);
}

// setBlanks: outputs the correct number of blanks to the wordX element based on the word chosen
var setBlanks = function () {

    for (var i = 0; i < chosenWord.length; i++) {
        wordBlanks.push(" _ ");
    }

    printArrayNoCommas(wordBlanks, wordXElem);

}

//setImg

var setImg = function () {
    pokemon.src = "./assets/images/" + chosenWord + "/" + chosenWord + "Sil.svg"
}

// newGame: 
var newGame = function () {
    
    clearWord();
    chooseWord();
    setBlanks();
    setImg();
    setGuesses();
    guessesElem.textContent = guesses;
}

//guessAsses: "sanitizes" user input and outputs appropriate response
var guessAssess = function (keyLimit, keyPressed) {


    if (keyPressed !== "shift" && keyPressed !== "meta" && keyPressed !== "backspace" && keyPressed !== " " && keyPressed !== "enter") {

        var wordBlankString = wordBlanks.toString();
        var userInputString = userInput.toString();
        var wordBlankCheck = wordBlankString.match(keyPressed);
        var userInputCheck = userInputString.match(keyPressed);

        if (wordBlankCheck === null && userInputCheck === null) {

            var rightCheck = chosenWord.match(keyPressed);
            console.log(rightCheck);

            if (rightCheck !== null) {
                guessRight(keyPressed);
            } else {
                guessWrong(keyPressed);
            }

        } else {
            repeatModal();
            //alert("Letter already guessed");

        }

    }
}

// guessWrong: manages user input if guess is wrong
var guessWrong = function (keyPressed) {
    userInput.push(keyPressed);
    guesses--;
    //letterBankElem.textContent = userInput;
    printArrayNoCommas(userInput, letterBankElem);
    setTimeout(checkLoss, 100);
}

// guessRight: manages user input if guess is correct
var guessRight = function (keyPressed) {

    var rightindices = [];
    for (var i = 0; i < chosenWord.length; i++) {
        if (keyPressed === chosenWord[i]) {
            rightindices.push(i);
        }
    }

    for (var i = 0; i < rightindices.length; i++) {
        var replaceIndex = rightindices[i];
        var letterToReplace = chosenWord[rightindices[i]];
        //console.log(replaceIndex);
        //console.log(letterToReplace);
        wordBlanks[replaceIndex] = "  " + letterToReplace + "  ";
        //console.log(wordBlanks);

    }
    guesses--;
    printArrayNoCommas(wordBlanks, wordXElem);


}

var revealNoise = function () {
    audioElement.setAttribute("src", "assets/captainplanet24.mp3");
    audioElement.play();
}

var winModal = function(){
    document.removeEventListener("keydown", keylisten);
    var newGameBtn = `<button id="newGameBtn" type="button" class="btn btn-primary">Play Again</button>`;
    var quitBtn = `<button id="quitBtn" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;

    $("#modal-title").text("YOU WIN!!!");
    $("#modal-body").html(`It was ${chosenWord}`);
    $("#modal-footer").empty();
    $("#modal-footer").append(newGameBtn + quitBtn);

    $("#newGameBtn").click( e =>{
        e.preventDefault();
        newGame();

        $("#modal").modal("hide");
    });

    $("#quitBtn").click( e =>{
        e.preventDefault();
        
    });

    $("#modal").modal("show");
}

var loseModal = function(){
    document.removeEventListener("keydown", keylisten);
    var newGameBtn = `<button id="newGameBtn" type="button" class="btn btn-primary">Play Again</button>`;
    var quitBtn = `<button id="quitBtn" type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`;

    $("#modal-title").text("YOU LOSE!!!");
    $("#modal-body").html(`It was ${chosenWord}`);
    $("#modal-footer").empty();
    $("#modal-footer").append(newGameBtn + quitBtn);

    $("#newGameBtn").click( e =>{
        e.preventDefault();
        newGame();
        $("#modal").modal("hide");
        document.addEventListener("keydown", keylisten);
    });

    $("#quitBtn").click( e =>{
        e.preventDefault();
        
    });

    $("#modal").modal("show");
}

var repeatModal = function(){
    document.removeEventListener("keydown", keylisten);
    var okBtn = `<button id="okBtn" type="button" class="btn btn-primary">OK</button>`;
    
    $("#modal-title").text("Already Guessed");
    $("#modal-body").html(`You have already guessed this letter, try another...`);
    $("#modal-footer").empty();
    $("#modal-footer").append(okBtn);

    $("#modal").modal("show");

    $("#okBtn").click(function(e){
        e.preventDefault();
        $("#modal").modal("hide");
        document.addEventListener("keydown", keylisten);
    })
}

var win = function () {
    //alert("WINNER!!!");
    winModal();
    wins++;
    winsElem.textContent = wins;
    
}

//checkWin
var checkWin = function () {
    var wordBlankString = wordBlanks.toString();
    var wordBlankCheck = wordBlankString.match(/_/);
    if (wordBlankCheck === null) {
        pokemon.src = "./assets/images/" + chosenWord + "/" + chosenWord + ".svg";
        setTimeout(win, 100);


    }
}

var loss = function () {
    loseModal();
}

//checkLoss
var checkLoss = function () {
    if (guesses <= 0) {
        pokemon.src = "./assets/images/" + chosenWord + "/" + chosenWord + ".svg";
        setTimeout(loss, 100);
        //alert("LOSER!!!");
        //newGame();
    }
}




winsElem.textContent = wins;
newGame();

document.addEventListener("keydown", keylisten);


function keylisten(e) {
    var rawkeyStroke = e.key;
    var keyStroke = rawkeyStroke.toLowerCase();
    var patt1 = /[a-z]/i;
    var keyRange = keyStroke.match(patt1);
    guessAssess(keyRange, keyStroke);
    guessesElem.textContent = guesses;

}


